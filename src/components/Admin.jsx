import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const GITHUB_OWNER = 'naguilarg';
const GITHUB_REPO = 'colmillo-web-production';
const JSON_PATH = 'src/data/projects.json';

const Admin = () => {
    const [token, setToken] = useState(localStorage.getItem('github_pat') || '');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');
    const [editingProject, setEditingProject] = useState(null); // null = list mode, {} = new, object = edit
    const [sha, setSha] = useState(''); // Needed for GitHub API updates

    useEffect(() => {
        if (token) {
            verifyTokenAndLoadData();
        }
    }, []);

    const verifyTokenAndLoadData = async () => {
        setLoading(true);
        setStatus('Verifying token & fetching data...');
        try {
            const response = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${JSON_PATH}`, {
                headers: {
                    Authorization: `token ${token}`,
                    Accept: 'application/vnd.github.v3+json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setSha(data.sha);
                const content = JSON.parse(atob(data.content));
                setProjects(content);
                setIsAuthenticated(true);
                localStorage.setItem('github_pat', token);
                setStatus('');
            } else {
                setStatus('Error: Invalid Token or unauthorized.');
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error(error);
            setStatus('Network Error.');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (newProjectsList) => {
        setLoading(true);
        setStatus('Saving to GitHub...');
        try {
            // 1. Get latest SHA first to avoid conflicts (optimistic locking)
            const currentFile = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${JSON_PATH}`, {
                headers: { Authorization: `token ${token}` }
            }).then(r => r.json());

            const message = editingProject && editingProject.id
                ? `Update project: ${editingProject.title}`
                : 'Update projects via Admin';

            const body = {
                message: message,
                content: btoa(JSON.stringify(newProjectsList, null, 2)), // Base64 encode
                sha: currentFile.sha // Use freshest SHA
            };

            const response = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${JSON_PATH}`, {
                method: 'PUT',
                headers: {
                    Authorization: `token ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            if (response.ok) {
                const data = await response.json();
                setSha(data.content.sha);
                setProjects(newProjectsList);
                setEditingProject(null);
                setStatus('Success! Changes committed. Vercel will deploy shortly.');
            } else {
                setStatus('Error saving to GitHub.');
            }
        } catch (error) {
            console.error(error);
            setStatus('Save failed.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id) => {
        if (window.confirm('Delete this project?')) {
            const updated = projects.filter(p => p.id !== id);
            handleSave(updated);
        }
    };

    const handleEditSave = (project) => {
        let updated;
        if (projects.find(p => p.id === project.id)) {
            updated = projects.map(p => p.id === project.id ? project : p);
        } else {
            // New project
            updated = [...projects, { ...project, id: Math.max(...projects.map(p => p.id), 0) + 1 }];
        }
        handleSave(updated);
    };

    const moveProject = (index, direction) => {
        const newProjects = [...projects];
        if (direction === 'up' && index > 0) {
            [newProjects[index], newProjects[index - 1]] = [newProjects[index - 1], newProjects[index]];
        } else if (direction === 'down' && index < newProjects.length - 1) {
            [newProjects[index], newProjects[index + 1]] = [newProjects[index + 1], newProjects[index]];
        } else {
            return;
        }
        setProjects(newProjects); // Optimistic UI update
        handleSave(newProjects);
    };

    if (!isAuthenticated) {
        return (
            <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', gap: '20px' }}>
                <h1>Colmillo Admin</h1>
                <input
                    type="password"
                    placeholder="GitHub Personal Access Token"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    style={{ padding: '10px', width: '300px', borderRadius: '5px', border: '1px solid #333', background: '#000', color: '#fff' }}
                />
                <button onClick={verifyTokenAndLoadData} disabled={loading} style={{ padding: '10px 20px', cursor: 'pointer', background: '#fff', color: '#000', border: 'none', borderRadius: '5px' }}>
                    {loading ? 'Verifying...' : 'Login'}
                </button>
                <p style={{ color: 'red' }}>{status}</p>
            </div>
        );
    }

    return (
        <div style={{ height: '100vh', padding: '100px 50px', overflowY: 'auto', color: '#fff', background: '#111' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
                <h1>Dashboard</h1>
                <button onClick={() => setEditingProject({ credits: [] })} style={{ padding: '10px', background: '#fff', color: '#000', border: 'none', cursor: 'pointer' }}>
                    + New Project
                </button>
            </div>

            {status && <div style={{ padding: '10px', background: '#333', marginBottom: '20px' }}>{status}</div>}

            {editingProject ? (
                <ProjectEditor
                    project={editingProject}
                    onSave={handleEditSave}
                    onCancel={() => setEditingProject(null)}
                    loading={loading}
                />
            ) : (
                <div style={{ display: 'grid', gap: '20px' }}>
                    {projects.map((p, index) => (
                        <div key={p.id} style={{ border: '1px solid #333', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h3 style={{ margin: 0 }}>{p.title}</h3>
                                <small style={{ opacity: 0.6 }}>{p.category} | {p.year}</small>
                            </div>
                            <div style={{ gap: '10px', display: 'flex' }}>
                                <button onClick={() => moveProject(index, 'up')} disabled={index === 0} style={{ padding: '5px 10px', cursor: 'pointer', opacity: index === 0 ? 0.3 : 1 }}>↑</button>
                                <button onClick={() => moveProject(index, 'down')} disabled={index === projects.length - 1} style={{ padding: '5px 10px', cursor: 'pointer', opacity: index === projects.length - 1 ? 0.3 : 1 }}>↓</button>
                                <button onClick={() => setEditingProject(p)} style={{ padding: '5px 10px', cursor: 'pointer' }}>Edit</button>
                                <button onClick={() => handleDelete(p.id)} style={{ padding: '5px 10px', background: 'red', color: 'white', border: 'none', cursor: 'pointer' }}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// Sub-component for form
const ProjectEditor = ({ project, onSave, onCancel, loading }) => {
    const [formData, setFormData] = useState(project);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleCreditChange = (index, field, value) => {
        const newCredits = [...(formData.credits || [])];
        newCredits[index] = { ...newCredits[index], [field]: value };
        setFormData(prev => ({ ...prev, credits: newCredits }));
    };

    const addCredit = () => {
        setFormData(prev => ({ ...prev, credits: [...(prev.credits || []), { role: '', name: '' }] }));
    };

    const removeCredit = (index) => {
        const newCredits = [...(formData.credits || [])];
        newCredits.splice(index, 1);
        setFormData(prev => ({ ...prev, credits: newCredits }));
    };

    return (
        <div style={{ maxWidth: '800px', background: '#000', padding: '30px', border: '1px solid #333' }}>
            <h2>{project.id ? 'Edit Project' : 'New Project'}</h2>

            <div style={{ display: 'grid', gap: '15px', marginBottom: '20px' }}>
                <input placeholder="Title" value={formData.title || ''} onChange={e => handleChange('title', e.target.value)} style={inputStyle} />
                <div style={{ display: 'flex', gap: '10px' }}>
                    <input placeholder="Category" value={formData.category || ''} onChange={e => handleChange('category', e.target.value)} style={{ ...inputStyle, flex: 1 }} />
                    <input placeholder="Year" value={formData.year || ''} onChange={e => handleChange('year', e.target.value)} style={{ ...inputStyle, width: '100px' }} />
                </div>
                <input placeholder="Video Path (e.g., /projects_vid/video.webm)" value={formData.video || ''} onChange={e => handleChange('video', e.target.value)} style={inputStyle} />
                <input placeholder="Full Video URL (e.g., https://youtube.com/...)" value={formData.fullVideoUrl || ''} onChange={e => handleChange('fullVideoUrl', e.target.value)} style={inputStyle} />
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#fff', fontSize: '0.9rem', padding: '5px 0' }}>
                    <input type="checkbox" checked={formData.showFullVideoUrl || false} onChange={e => handleChange('showFullVideoUrl', e.target.checked)} />
                    Mostrar Botón de "Vídeo Completo"
                </label>
                <textarea placeholder="Description" value={formData.description || ''} onChange={e => handleChange('description', e.target.value)} style={{ ...inputStyle, height: '100px' }} />
            </div>

            <h3>Credits</h3>
            <div style={{ display: 'grid', gap: '10px', marginBottom: '20px' }}>
                {(formData.credits || []).map((credit, i) => (
                    <div key={i} style={{ display: 'flex', gap: '10px' }}>
                        <input placeholder="Role" value={credit.role} onChange={e => handleCreditChange(i, 'role', e.target.value)} style={{ ...inputStyle, flex: 1 }} />
                        <input placeholder="Name" value={credit.name} onChange={e => handleCreditChange(i, 'name', e.target.value)} style={{ ...inputStyle, flex: 1 }} />
                        <button onClick={() => removeCredit(i)} style={{ background: 'red', color: 'white', border: 'none', cursor: 'pointer' }}>X</button>
                    </div>
                ))}
                <button onClick={addCredit} style={{ padding: '5px', background: '#333', color: '#fff', border: 'none', cursor: 'pointer', width: 'fit-content' }}>+ Add Credit</button>
            </div>

            <div style={{ display: 'flex', gap: '15px' }}>
                <button onClick={() => onSave(formData)} disabled={loading} style={{ padding: '10px 30px', background: '#fff', color: '#000', border: 'none', cursor: 'pointer' }}>
                    {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button onClick={onCancel} style={{ padding: '10px 20px', background: 'transparent', color: '#fff', border: '1px solid #fff', cursor: 'pointer' }}>Cancel</button>
            </div>
        </div>
    );
};

const inputStyle = {
    padding: '10px',
    background: '#1a1a1a',
    border: '1px solid #333',
    color: '#fff',
    width: '100%'
};

export default Admin;
