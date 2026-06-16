// src/pages/admin/AdminSettings.jsx
import React, { useState } from 'react';
import { adminApi } from '../../api/adminApi';
import toast from 'react-hot-toast';
import { 
  FiSettings, FiShield, FiGlobe, FiBell, FiLock,
  FiSave, FiDownload, FiRefreshCw, FiFileText,
  FiUsers, FiPackage, FiBriefcase, FiStar
} from 'react-icons/fi';

const AdminSettings = () => {
    const [loading, setLoading] = useState(false);
    const [exportType, setExportType] = useState('users');

    const handleExport = async () => {
        setLoading(true);
        try {
            const response = await adminApi.exportData(exportType);
            console.log('📊 Export:', response.data);
            
            // Créer un fichier CSV
            const data = response.data.data;
            if (data.length > 0) {
                const headers = Object.keys(data[0]);
                const csvContent = [
                    headers.join(','),
                    ...data.map(row => headers.map(h => JSON.stringify(row[h] || '')).join(','))
                ].join('\n');
                
                const blob = new Blob([csvContent], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${exportType}_export_${new Date().toISOString().split('T')[0]}.csv`;
                a.click();
                window.URL.revokeObjectURL(url);
                
                toast.success(`Export ${exportType} réussi`);
            } else {
                toast.warning('Aucune donnée à exporter');
            }
        } catch (error) {
            console.error('Erreur export:', error);
            toast.error('Erreur lors de l\'export');
        } finally {
            setLoading(false);
        }
    };

    const exportOptions = [
        { value: 'users', label: 'Utilisateurs', icon: FiUsers },
        { value: 'orders', label: 'Commandes', icon: FiPackage },
        { value: 'services', label: 'Services', icon: FiBriefcase }
    ];

    const settingsSections = [
        {
            title: 'Sécurité',
            icon: FiShield,
            description: 'Gérer la sécurité de la plateforme',
            settings: [
                { label: 'Authentification à deux facteurs', enabled: false },
                { label: 'Session timeout (minutes)', value: 30 },
                { label: 'Tentatives de connexion max', value: 5 }
            ]
        },
        {
            title: 'Notifications',
            icon: FiBell,
            description: 'Configurer les notifications système',
            settings: [
                { label: 'Notifications par email', enabled: true },
                { label: 'Notifications push', enabled: true },
                { label: 'Rapports hebdomadaires', enabled: false }
            ]
        },
        {
            title: 'Plateforme',
            icon: FiGlobe,
            description: 'Paramètres généraux de la plateforme',
            settings: [
                { label: 'Commission plateforme (%)', value: 10 },
                { label: 'Délai de livraison max (jours)', value: 30 },
                { label: 'Paiement minimum (DH)', value: 100 }
            ]
        }
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-heading font-bold text-[#1A1208] flex items-center gap-2">
                        <FiSettings className="text-[#3D5A3E]" />
                        Paramètres
                    </h1>
                    <p className="text-[#6B5E4F] text-sm mt-1">
                        Gérez les paramètres de la plateforme
                    </p>
                </div>
            </div>

            {/* Export Section */}
            <div className="bg-white rounded-2xl border border-[#E8E2D9] p-6">
                <h2 className="text-lg font-heading font-semibold text-[#1A1208] mb-4 flex items-center gap-2">
                    <FiFileText className="text-[#3D5A3E]" />
                    Exporter les données
                </h2>
                <div className="flex flex-col sm:flex-row gap-4">
                    <select
                        value={exportType}
                        onChange={(e) => setExportType(e.target.value)}
                        className="px-4 py-2 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl focus:outline-none focus:border-[#3D5A3E] text-sm"
                    >
                        {exportOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={handleExport}
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-2 bg-[#3D5A3E] hover:bg-[#2D452E] text-white rounded-xl font-semibold transition-all disabled:opacity-50"
                    >
                        {loading ? (
                            <><FiRefreshCw className="animate-spin" size={16} /> Export...</>
                        ) : (
                            <><FiDownload size={16} /> Exporter CSV</>
                        )}
                    </button>
                </div>
            </div>

            {/* Settings Sections */}
            <div className="space-y-4">
                {settingsSections.map((section, idx) => (
                    <div key={idx} className="bg-white rounded-2xl border border-[#E8E2D9] p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-[#E8EDE6] rounded-xl">
                                <section.icon className="text-[#3D5A3E]" size={20} />
                            </div>
                            <div>
                                <h3 className="font-heading font-semibold text-[#1A1208]">{section.title}</h3>
                                <p className="text-xs text-[#6B5E4F]">{section.description}</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {section.settings.map((setting, sIdx) => (
                                <div key={sIdx} className="flex items-center justify-between p-3 bg-[#FAF8F5] rounded-xl">
                                    <span className="text-sm text-[#1A1208]">{setting.label}</span>
                                    {setting.enabled !== undefined ? (
                                        <button
                                            className={`relative w-12 h-6 rounded-full transition-all ${
                                                setting.enabled ? 'bg-[#3D5A3E]' : 'bg-[#E8E2D9]'
                                            }`}
                                        >
                                            <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all ${
                                                setting.enabled ? 'right-0.5' : 'left-0.5'
                                            }`} />
                                        </button>
                                    ) : (
                                        <input
                                            type="number"
                                            value={setting.value}
                                            className="w-20 px-3 py-1 bg-white border border-[#E8E2D9] rounded-lg text-sm focus:outline-none focus:border-[#3D5A3E]"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
                <button
                    className="flex items-center gap-2 px-6 py-3 bg-[#3D5A3E] hover:bg-[#2D452E] text-white rounded-xl font-semibold transition-all"
                >
                    <FiSave size={18} />
                    Enregistrer les paramètres
                </button>
            </div>
        </div>
    );
};

export default AdminSettings;