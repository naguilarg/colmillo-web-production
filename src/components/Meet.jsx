import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, User, ArrowRight, ShieldCheck, Video, X } from 'lucide-react';
import MinimalLogo from './MinimalLogo';

const Meet = ({ setCurrentView }) => {
    // --- STATE MANAGEMENT ---
    const [inMeeting, setInMeeting] = useState(false);
    const [roomName, setRoomName] = useState('');
    const [userName, setUserName] = useState('');

    // Admin State
    const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
    const [adminPasswordInput, setAdminPasswordInput] = useState('');
    const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
    const [newRoomPassword, setNewRoomPassword] = useState('');

    // Jitsi References
    const jitsiRef = useRef(null);
    const jitsiApiRef = useRef(null);

    // --- ANIMATION VARIANTS ---
    const containerVariants = {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
        exit: { opacity: 0, transition: { duration: 0.5 } }
    };

    const panelVariants = {
        hidden: { opacity: 0, scale: 0.9, y: 20 },
        visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } },
        exit: { opacity: 0, scale: 0.95, y: 10 }
    };

    // --- JITSI LOADING LOGIC ---
    useEffect(() => {
        // Load the Jitsi External API script if not already loaded
        if (!window.JitsiMeetExternalAPI) {
            const script = document.createElement("script");
            // We use the official script source, it works for other domains too usually
            script.src = "https://meet.jit.si/external_api.js";
            script.async = true;
            document.body.appendChild(script);
        }
    }, []);

    const handleJoinRoom = (isCreating = false) => {
        if (!roomName.trim() || !userName.trim()) return;
        setInMeeting(true);
    };

    const handleHangup = () => {
        if (jitsiApiRef.current) {
            jitsiApiRef.current.dispose();
            jitsiApiRef.current = null;
        }
        setInMeeting(false);
        setNewRoomPassword('');
    };

    // --- INITIALIZE MEETING ---
    useEffect(() => {
        let api = null;
        let timeoutId = null;

        const startMeeting = () => {
            if (!inMeeting || !window.JitsiMeetExternalAPI) return;

            // Ensure container exists
            if (!jitsiRef.current) {
                timeoutId = setTimeout(startMeeting, 100);
                return;
            }

            console.log('Initializing Jitsi on Guifi.net...');

            // DOMAIN: Using meet.guifi.net (Community Open Network) - typically cleaner UI
            const domain = "meet.guifi.net";

            // Generate a safe room name
            const safeRoomName = `colmillo-${roomName.replace(/\s+/g, '-').toLowerCase()}`;

            const options = {
                roomName: safeRoomName,
                width: '100%',
                height: '100%',
                parentNode: jitsiRef.current,
                userInfo: {
                    displayName: userName
                },
                configOverwrite: {
                    startWithAudioMuted: true,
                    startWithVideoMuted: true,
                    prejoinPageEnabled: false,
                    enableWelcomePage: false,
                    enableClosePage: false,
                    requireDisplayName: false,
                    disableDeepLinking: true,
                    enableInsecureRoomNameWarning: false,
                },
                interfaceConfigOverwrite: {
                    SHOW_JITSI_WATERMARK: false,
                    SHOW_WATERMARK_FOR_GUESTS: false,
                    SHOW_BRAND_WATERMARK: false,
                    JITSI_WATERMARK_LINK: '',
                    SHOW_POWERED_BY: false,
                    SHOW_DEEP_LINKING_IMAGE: false,
                    MOBILE_APP_PROMO: false,
                    DEFAULT_BACKGROUND: '#000000',
                    DEFAULT_LOCAL_DISPLAY_NAME: 'Yo',
                    TOOLBAR_BUTTONS: [
                        'microphone', 'camera', 'desktop', 'fullscreen',
                        'fodeviceselection', 'hangup', 'chat', 'raisehand',
                        'videoquality', 'tileview', 'videobackgroundblur'
                    ]
                }
            };

            try {
                api = new window.JitsiMeetExternalAPI(domain, options);
                jitsiApiRef.current = api;

                api.addEventListeners({
                    readyToClose: handleHangup,
                    videoConferenceJoined: () => {
                        if (isAdminAuthenticated && newRoomPassword) {
                            api.executeCommand('password', newRoomPassword);
                        }
                    }
                });
            } catch (err) {
                console.error("Jitsi Init Error:", err);
                setInMeeting(false);
            }
        };

        if (inMeeting) {
            // Slight delay to allow render
            timeoutId = setTimeout(startMeeting, 100);
        }

        return () => {
            if (timeoutId) clearTimeout(timeoutId);
            if (api) {
                api.dispose();
                jitsiApiRef.current = null;
            }
        };
    }, [inMeeting, roomName, userName, isAdminAuthenticated, newRoomPassword]);

    // --- ADMIN AUTH LOGIC ---
    const handleAdminUnlock = () => {
        if (adminPasswordInput === 'colmillo2024') {
            setIsAdminAuthenticated(true);
            setAdminPasswordInput('');
        } else {
            alert("Contraseña incorrecta");
        }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{
                width: '100%',
                height: '100vh',
                position: 'relative',
                background: '#0a0a0a',
                color: '#fff',
                fontFamily: 'var(--font-sans)',
                overflow: 'hidden'
            }}
        >
            {/* Logo in corner */}
            <div
                style={{
                    position: 'absolute',
                    top: 40,
                    left: 40,
                    zIndex: 100, // Higher than everything
                    cursor: 'pointer',
                    width: '50px'
                }}
                onClick={() => handleHangup()}
            >
                <MinimalLogo />
            </div>

            <AnimatePresence mode="wait">
                {!inMeeting ? (
                    <motion.div
                        key="lobby"
                        variants={containerVariants}
                        style={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'column'
                        }}
                    >
                        {/* Admin Trigger Icon */}
                        <div
                            style={{ position: 'absolute', top: 40, right: 40, cursor: 'pointer', opacity: 0.3, zIndex: 60 }}
                            onClick={() => setIsAdminPanelOpen(true)}
                        >
                            <Lock size={20} />
                        </div>

                        {/* Title */}
                        <motion.h1
                            style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', fontFamily: 'var(--font-serif)', marginBottom: '10px', textAlign: 'center' }}
                            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
                        >
                            sala de reuniones
                        </motion.h1>
                        <motion.p
                            style={{ marginBottom: '50px', letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.8rem', opacity: 0.6 }}
                            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 0.6 }} transition={{ delay: 0.3 }}
                        >
                            espacio de trabajo privado
                        </motion.p>

                        {/* Form */}
                        <motion.div
                            style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', maxWidth: '350px' }}
                            initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}
                        >
                            {!isAdminAuthenticated ? (
                                <>
                                    <div className="input-group" style={{ position: 'relative' }}>
                                        <User size={18} style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
                                        <input
                                            type="text"
                                            placeholder="Tu nombre"
                                            value={userName}
                                            onChange={(e) => setUserName(e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '15px 15px 15px 45px',
                                                background: 'rgba(255,255,255,0.05)',
                                                border: '1px solid rgba(255,255,255,0.1)',
                                                borderRadius: '8px',
                                                color: '#fff',
                                                outline: 'none'
                                            }}
                                        />
                                    </div>
                                    <div className="input-group" style={{ position: 'relative' }}>
                                        <Video size={18} style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
                                        <input
                                            type="text"
                                            placeholder="Nombre de la sala"
                                            value={roomName}
                                            onChange={(e) => setRoomName(e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '15px 15px 15px 45px',
                                                background: 'rgba(255,255,255,0.05)',
                                                border: '1px solid rgba(255,255,255,0.1)',
                                                borderRadius: '8px',
                                                color: '#fff',
                                                outline: 'none'
                                            }}
                                        />
                                    </div>
                                    <button
                                        onClick={() => handleJoinRoom(false)}
                                        disabled={!roomName || !userName}
                                        style={{
                                            padding: '15px',
                                            borderRadius: '8px',
                                            background: '#fff',
                                            color: '#000',
                                            border: 'none',
                                            fontSize: '1rem',
                                            fontWeight: '600',
                                            cursor: !roomName || !userName ? 'not-allowed' : 'pointer',
                                            opacity: !roomName || !userName ? 0.5 : 1,
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            gap: '10px'
                                        }}
                                    >
                                        ENTRAR <ArrowRight size={18} />
                                    </button>
                                </>
                            ) : (
                                // Admin View (Simplified)
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    <div style={{ padding: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px', textAlign: 'center', color: '#aaa' }}>
                                        <ShieldCheck size={16} /> Admin Mode
                                    </div>
                                    <input type="text" placeholder="Tu nombre (Admin)" value={userName} onChange={(e) => setUserName(e.target.value)} style={{ padding: '15px', borderRadius: '8px', border: '1px solid #333', background: '#222', color: '#fff' }} />
                                    <input type="text" placeholder="Nombre de sala" value={roomName} onChange={(e) => setRoomName(e.target.value)} style={{ padding: '15px', borderRadius: '8px', border: '1px solid #333', background: '#222', color: '#fff' }} />
                                    <input type="password" placeholder="Contraseña de sala" value={newRoomPassword} onChange={(e) => setNewRoomPassword(e.target.value)} style={{ padding: '15px', borderRadius: '8px', border: '1px solid #333', background: '#222', color: '#fff' }} />
                                    <button onClick={() => handleJoinRoom(true)} disabled={!roomName} style={{ padding: '15px', borderRadius: '8px', background: '#fff', color: '#000', fontWeight: 'bold', cursor: 'pointer' }}>CREAR SALA SEGURA</button>
                                </div>
                            )}
                        </motion.div>

                        {/* Admin Modal */}
                        <AnimatePresence>
                            {isAdminPanelOpen && !isAdminAuthenticated && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    style={{
                                        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                                        background: 'rgba(0,0,0,0.85)', zIndex: 100, display: 'flex', justifyContent: 'center', alignItems: 'center'
                                    }}
                                >
                                    <motion.div variants={panelVariants} initial="hidden" animate="visible" exit="exit" style={{ background: '#111', padding: '40px', borderRadius: '16px', border: '1px solid #333', width: '90%', maxWidth: '400px', position: 'relative' }}>
                                        <X size={20} style={{ position: 'absolute', top: 15, right: 15, cursor: 'pointer', opacity: 0.5 }} onClick={() => setIsAdminPanelOpen(false)} />
                                        <h3 style={{ marginBottom: '20px', fontFamily: 'var(--font-serif)', fontSize: '1.5rem' }}>Acceso Admin</h3>
                                        <input type="password" autoFocus placeholder="Contraseña" value={adminPasswordInput} onChange={(e) => setAdminPasswordInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAdminUnlock()} style={{ width: '100%', padding: '12px', background: '#222', border: '1px solid #444', color: '#fff', borderRadius: '8px', marginBottom: '15px' }} />
                                        <button onClick={handleAdminUnlock} style={{ width: '100%', padding: '12px', background: '#fff', color: '#000', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>DESBLOQUEAR</button>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ) : (
                    // Meeting View
                    <motion.div
                        key="meeting"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ width: '100%', height: '100%', position: 'relative' }}
                    >
                        <div ref={jitsiRef} style={{ width: '100%', height: '100%', background: '#000' }} />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default Meet;
