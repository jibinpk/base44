import React, { useState } from 'react';
import { AppConfig } from "@/entities/AppConfig";
import { Plus, Save, Trash2, Edit, X, Check } from 'lucide-react';

export default function ConfigEditor({ configId, title, description, icon: Icon, initialOptions }) {
  const [options, setOptions] = useState(initialOptions);
  const [newOption, setNewOption] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await AppConfig.update(configId, { value: options });
    } catch (error) {
      console.error("Failed to save config:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddOption = () => {
    if (newOption.trim()) {
      const updatedOptions = [...options, newOption.trim()];
      setOptions(updatedOptions);
      setNewOption('');
    }
  };

  const handleRemoveOption = (indexToRemove) => {
    const updatedOptions = options.filter((_, index) => index !== indexToRemove);
    setOptions(updatedOptions);
  };
  
  const handleEdit = (option, index) => {
      setEditingIndex(index);
      setEditingText(option);
  };
  
  const handleUpdateOption = () => {
      if(editingText.trim()) {
          const updatedOptions = [...options];
          updatedOptions[editingIndex] = editingText.trim();
          setOptions(updatedOptions);
          setEditingIndex(null);
          setEditingText('');
      }
  };

  return (
    <div className="neumorphic-card p-8">
      <div className="flex items-start gap-4 mb-4">
        <Icon className="w-8 h-8 mt-1" style={{color: 'var(--accent)'}} />
        <div>
            <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>{title}</h2>
            <p style={{ color: 'var(--text-secondary)' }}>{description}</p>
        </div>
      </div>
      
      <div className="space-y-3 mb-6">
        {options.map((option, index) => (
          <div key={index} className="neumorphic-inset p-3 rounded-xl flex items-center justify-between">
            {editingIndex === index ? (
                <input
                    type="text"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    className="input-neumorphic w-full px-3 py-1 rounded-lg font-medium"
                    autoFocus
                />
            ) : (
                <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{option}</span>
            )}
            
            <div className="flex items-center gap-2">
                {editingIndex === index ? (
                    <>
                        <button onClick={handleUpdateOption} className="neumorphic-button p-2 rounded-lg" style={{ color: '#43e97b' }}><Check className="w-4 h-4" /></button>
                        <button onClick={() => setEditingIndex(null)} className="neumorphic-button p-2 rounded-lg" style={{ color: 'var(--text-secondary)' }}><X className="w-4 h-4" /></button>
                    </>
                ) : (
                    <>
                        <button onClick={() => handleEdit(option, index)} className="neumorphic-button p-2 rounded-lg" style={{ color: 'var(--accent)' }}><Edit className="w-4 h-4" /></button>
                        <button onClick={() => handleRemoveOption(index)} className="neumorphic-button p-2 rounded-lg" style={{ color: '#f5576c' }}><Trash2 className="w-4 h-4" /></button>
                    </>
                )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3 mb-6">
        <input
          type="text"
          value={newOption}
          onChange={(e) => setNewOption(e.target.value)}
          placeholder="Add new option..."
          className="input-neumorphic flex-grow px-4 py-3 rounded-xl font-medium"
        />
        <button onClick={handleAddOption} className="neumorphic-button px-4 rounded-xl" style={{ color: 'var(--accent)' }}>
            <Plus className="w-5 h-5"/>
        </button>
      </div>

      <button 
        onClick={handleSave}
        disabled={isSaving}
        className="neumorphic-button w-full px-6 py-3 rounded-xl font-medium flex items-center justify-center gap-2" 
        style={{ color: 'var(--accent)' }}>
          <Save className="w-4 h-4" />
          {isSaving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}