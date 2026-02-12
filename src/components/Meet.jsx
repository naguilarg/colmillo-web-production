import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, User, ArrowRight, ShieldCheck, Video, X } from 'lucide-react';
import MinimalLogo from './MinimalLogo';

const Meet = ({ setCurrentView }) => {
    // State for Lobby vs Meeting
    const [inMeeting, setInMeeting] = useState(false);

    // State for inputs
    const [roomName, setRoomName] = useState('');
    const [userName, setUserName] = useState('');

    // State for Admin Panel
    const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
    const [adminPasswordInput, setAdminPasswordInput] = useState('');
    const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

    // State for new room configuration (Admin only)
    const [newRoomPassword, setNewRoomPassword] = useState('');

    // Jitsi ref
    const jitsiRef = useRef(null);
    const jitsiApiRef = useRef(null);

    // Variants for animations
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

    // State for script loading
    const [isScriptLoaded, setIsScriptLoaded] = useState(false);
    const [isJitsiLoading, setIsJitsiLoading] = useState(false);

    // Helper to load Jitsi script
    useEffect(() => {
        if (!window.JitsiMeetExternalAPI) {
            console.log('Loading Jitsi script...');
            const script = document.createElement("script");
            script.src = "https://meet.jit.si/external_api.js";
            script.async = true;
            script.onload = () => {
                console.log('Jitsi script loaded successfully');
                setIsScriptLoaded(true);
            };
            script.onerror = () => {
                console.error('Failed to load Jitsi script');
                alert('Error al cargar Jitsi. Por favor, verifica tu conexión a internet.');
            };
            document.body.appendChild(script);
        } else {
            console.log('Jitsi script already loaded');
            setIsScriptLoaded(true);
        }
    }, []);

    const handleJoinRoom = (isCreating = false) => {
        if (!roomName.trim() || !userName.trim()) return;
        console.log('Joining room:', roomName, 'as', userName);
        setInMeeting(true);
    };

    // Initialize Jitsi when inMeeting becomes true
    useEffect(() => {
        let timeoutId;

        const initJitsi = () => {
            if (!inMeeting || !window.JitsiMeetExternalAPI) {
                return;
            }

            if (!jitsiRef.current) {
                console.error('Jitsi container not found, retrying...');
                // Retry after a short delay
                timeoutId = setTimeout(initJitsi, 200);
                return;
            }

            console.log('Initializing Jitsi with container:', jitsiRef.current);
            setIsJitsiLoading(true);

            const domain = "meet.jit.si";
            const options = {
                roomName: roomName,
                width: '100%',
                height: '100%',
                parentNode: jitsiRef.current,
                userInfo: {
                    displayName: userName
                },
                configOverwrite: {
                    startWithAudioMuted: true,
                    startWithVideoMuted: true,
                    enableWelcomePage: false,
                    prejoinPageEnabled: false,
                    disableDeepLinking: true,
                    enableClosePage: false,
                    requireDisplayName: false,
                    enableUserRolesBasedOnToken: false,
                    enableInsecureRoomNameWarning: false,
                },
                interfaceConfigOverwrite: {
                    TOOLBAR_BUTTONS: [
                        'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
                        'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
                        'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
                        'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
                        'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone',
                        'security'
                    ],
                    SHOW_JITSI_WATERMARK: false,
                    SHOW_WATERMARK_FOR_GUESTS: false,
                    DEFAULT_BACKGROUND: '#000000',
                    DEFAULT_LOCAL_DISPLAY_NAME: 'Yo',
                    DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
                }
            };

            try {
                const api = new window.JitsiMeetExternalAPI(domain, options);
                jitsiApiRef.current = api;
                console.log('Jitsi API initialized successfully');

                // Handle Events
                api.addEventListeners({
                    readyToClose: () => {
                        console.log('Jitsi ready to close');
                        handleHangup();
                    },
                    videoConferenceJoined: () => {
                        console.log('Video conference joined');
                        setIsJitsiLoading(false);
                        if (isAdminAuthenticated && newRoomPassword) {
                            api.executeCommand('password', newRoomPassword);
                        }
                    },
                    videoConferenceLeft: () => {
                        console.log('Video conference left');
                    }
                });
            } catch (error) {
                console.error('Error initializing Jitsi:', error);
                alert('Error al inicializar la videollamada: ' + error.message);
                setInMeeting(false);
                setIsJitsiLoading(false);
            }
        };

        if (inMeeting && window.JitsiMeetExternalAPI) {
            // Wait a bit for the DOM to be ready
            timeoutId = setTimeout(initJitsi, 100);
        } else if (inMeeting && !window.JitsiMeetExternalAPI) {
            console.error('Jitsi API not available');
            alert('El script de Jitsi no se ha cargado correctamente. Por favor, recarga la página.');
            setInMeeting(false);
        }

        // Cleanup function
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [inMeeting, roomName, userName, isAdminAuthenticated, newRoomPassword]);




    const handleHangup = () => {
        if (jitsiApiRef.current) {
            jitsiApiRef.current.dispose();
            jitsiApiRef.current = null;
        }
        setInMeeting(false);
        // Reset sensitive admin states optionally, or keep for re-entry
        setNewRoomPassword('');
    };

    const handleAdminUnlock = () => {
        // Simple client-side check for now as requested
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
            <div style={{ position: 'absolute', top: 40, left: 40, zIndex: 50, cursor: 'pointer', width: '50px' }} onClick={() => setCurrentView('home')}>
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
                        {/* Admin Trigger */}
                        <div
                            style={{ position: 'absolute', top: 40, right: 40, cursor: 'pointer', opacity: 0.3, zIndex: 60 }}
                            onClick={() => setIsAdminPanelOpen(true)}
                        >
                            <Lock size={20} />
                        </div>

                        {/* Welcome Text */}
                        <motion.h1
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            style={{
                                fontSize: 'clamp(2rem, 5vw, 4rem)',
                                fontFamily: 'var(--font-serif)',
                                marginBottom: '10px',
                                textAlign: 'center'
                            }}
                        >
                            sala de reuniones
                        </motion.h1>

                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 0.6 }}
                            transition={{ delay: 0.3 }}
                            style={{
                                marginBottom: '50px',
                                letterSpacing: '1px',
                                textTransform: 'uppercase',
                                fontSize: '0.8rem'
                            }}
                        >
                            espacio de trabajo privado
                        </motion.p>


                        {/* INPUT FORMS */}
                        <motion.div
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '20px',
                                width: '100%',
                                maxWidth: '350px'
                            }}
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
                                                fontSize: '1rem',
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
                                                fontSize: '1rem',
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
                                            gap: '10px',
                                            transition: 'transform 0.2s ease'
                                        }}
                                        onMouseEnter={(e) => !(!roomName || !userName) && (e.target.style.transform = 'scale(1.02)')}
                                        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                                    >
                                        ENTRAR <ArrowRight size={18} />
                                    </button>
                                </>
                            ) : (
                                // ADMIN CREATION VIEW
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
                                >
                                    <div style={{ padding: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px', textAlign: 'center', fontSize: '0.9rem', color: '#aaa', marginBottom: '10px' }}>
                                        <ShieldCheck size={16} style={{ marginBottom: '-3px', marginRight: '5px' }} /> Panel de Administrador
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Tu nombre (Admin)"
                                        value={userName}
                                        onChange={(e) => setUserName(e.target.value)}
                                        className="styled-input"
                                        style={{
                                            width: '100%',
                                            padding: '15px',
                                            background: 'rgba(255,255,255,0.05)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '8px',
                                            color: '#fff'
                                        }}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Crear nombre de sala"
                                        value={roomName}
                                        onChange={(e) => setRoomName(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '15px',
                                            background: 'rgba(255,255,255,0.05)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '8px',
                                            color: '#fff'
                                        }}
                                    />
                                    <input
                                        type="password"
                                        placeholder="Establecer contraseña (opcional)"
                                        value={newRoomPassword}
                                        onChange={(e) => setNewRoomPassword(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '15px',
                                            background: 'rgba(255,255,255,0.05)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '8px',
                                            color: '#fff'
                                        }}
                                    />
                                    <button
                                        onClick={() => handleJoinRoom(true)}
                                        disabled={!roomName || !userName}
                                        style={{
                                            padding: '15px',
                                            borderRadius: '8px',
                                            background: '#fff',
                                            color: '#000',
                                            border: 'none',
                                            fontWeight: 'bold',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        CREAR Y PROTEGER
                                    </button>
                                    <button
                                        onClick={() => setIsAdminAuthenticated(false)}
                                        style={{
                                            background: 'transparent',
                                            border: 'none',
                                            color: '#aaa',
                                            fontSize: '0.8rem',
                                            cursor: 'pointer',
                                            textDecoration: 'underline'
                                        }}
                                    >
                                        Salir del modo admin
                                    </button>
                                </motion.div>
                            )}
                        </motion.div>

                        {/* Admin Password Modal */}
                        <AnimatePresence>
                            {isAdminPanelOpen && !isAdminAuthenticated && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    style={{
                                        position: 'fixed',
                                        top: 0, left: 0, width: '100%', height: '100%',
                                        background: 'rgba(0,0,0,0.8)',
                                        zIndex: 100,
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}
                                >
                                    <motion.div
                                        variants={panelVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        style={{
                                            background: '#111',
                                            padding: '40px',
                                            borderRadius: '16px',
                                            border: '1px solid #333',
                                            width: '90%',
                                            maxWidth: '400px',
                                            position: 'relative'
                                        }}
                                    >
                                        <X
                                            size={20}
                                            style={{ position: 'absolute', top: 15, right: 15, cursor: 'pointer', opacity: 0.5 }}
                                            onClick={() => { setIsAdminPanelOpen(false); setAdminPasswordInput(''); }}
                                        />
                                        <h3 style={{ marginBottom: '20px', fontFamily: 'var(--font-serif)', fontSize: '1.5rem' }}>Acceso Admin</h3>
                                        <input
                                            type="password"
                                            autoFocus
                                            placeholder="Contraseña del sistema"
                                            value={adminPasswordInput}
                                            onChange={(e) => setAdminPasswordInput(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleAdminUnlock()}
                                            style={{
                                                width: '100%',
                                                padding: '12px',
                                                background: '#222',
                                                border: '1px solid #444',
                                                color: '#fff',
                                                borderRadius: '8px',
                                                marginBottom: '15px'
                                            }}
                                        />
                                        <button
                                            onClick={handleAdminUnlock}
                                            style={{
                                                width: '100%',
                                                padding: '12px',
                                                background: '#fff',
                                                color: '#000',
                                                border: 'none',
                                                borderRadius: '8px',
                                                fontWeight: 'bold',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            DESBLOQUEAR
                                        </button>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                    </motion.div>
                ) : (
                    // MEETING IFRAME CONTAINER
                    <motion.div
                        key="meeting"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.5 }}
                        style={{ width: '100%', height: '100%', position: 'relative' }}
                    >
                        <div ref={jitsiRef} style={{ width: '100%', height: '100%' }} />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default Meet;
