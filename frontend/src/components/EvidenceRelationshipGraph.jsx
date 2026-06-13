import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const EvidenceRelationshipGraph = ({ caseId }) => {
  const { authToken } = useAuth();
  const canvasRef = useRef(null);
  const [nodes, setNodes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [formData, setFormData] = useState({
    nodeType: 'suspect',
    nodeName: '',
    description: ''
  });

  useEffect(() => {
    loadRelationships();
  }, [caseId]);

  useEffect(() => {
    if (nodes.length > 0) {
      drawGraph();
    }
  }, [nodes]);

  const loadRelationships = async () => {
    try {
      const response = await fetch(`${API_URL}/api/relationships/case/${caseId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });

      if (!response.ok) throw new Error('Failed to load relationships');

      const data = await response.json();
      setNodes(data);
    } catch (error) {
      console.error('Error loading relationships:', error);
    }
  };

  const handleAddNode = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/api/relationships`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({
          caseId,
          ...formData
        })
      });

      if (!response.ok) throw new Error('Failed to create node');

      const newNode = await response.json();
      setNodes([...nodes, newNode]);
      setFormData({
        nodeType: 'suspect',
        nodeName: '',
        description: ''
      });
      setShowForm(false);
    } catch (error) {
      console.error('Error adding node:', error);
      alert('Failed to add node');
    }
  };

  const drawGraph = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.fillStyle = '#0a0b0f';
    ctx.fillRect(0, 0, width, height);

    // Calculate positions in a circular layout
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 3;

    const positions = nodes.map((node, index) => {
      const angle = (index / nodes.length) * 2 * Math.PI;
      return {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
        id: node._id
      };
    });

    // Draw connections
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.3)';
    ctx.lineWidth = 2;

    nodes.forEach((node, index) => {
      if (node.connections && node.connections.length > 0) {
        const pos1 = positions[index];
        node.connections.forEach((conn) => {
          const targetIndex = nodes.findIndex(n => n._id === conn.targetNodeId);
          if (targetIndex !== -1) {
            const pos2 = positions[targetIndex];
            ctx.beginPath();
            ctx.moveTo(pos1.x, pos1.y);
            ctx.lineTo(pos2.x, pos2.y);
            ctx.stroke();
          }
        });
      }
    });

    // Draw nodes
    nodes.forEach((node, index) => {
      const pos = positions[index];
      const colors = {
        'witness': '#3b82f6',
        'suspect': '#ef4444',
        'victim': '#fbbf24',
        'evidence': '#10b981'
      };

      const color = colors[node.nodeType] || '#6b7280';

      // Node circle
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 25, 0, 2 * Math.PI);
      ctx.fill();

      // Node label
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.nodeName.substring(0, 10), pos.x, pos.y - 35);

      // Node type icon
      const icons = {
        'witness': '👁️',
        'suspect': '🚨',
        'victim': '🏥',
        'evidence': '📦'
      };

      ctx.font = '16px Arial';
      ctx.fillText(icons[node.nodeType] || '•', pos.x, pos.y);
    });
  };

  const getNodeColor = (type) => {
    const colors = {
      'witness': 'bg-blue-500/10 border-blue-500/30 text-blue-300',
      'suspect': 'bg-red-500/10 border-red-500/30 text-red-300',
      'victim': 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300',
      'evidence': 'bg-green-500/10 border-green-500/30 text-green-300'
    };
    return colors[type] || 'bg-gray-500/10 border-gray-500/30 text-gray-300';
  };

  const getNodeIcon = (type) => {
    const icons = {
      'witness': '👁️',
      'suspect': '🚨',
      'victim': '🏥',
      'evidence': '📦'
    };
    return icons[type] || '•';
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#16171d] border border-[#2e303a] rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-100 flex items-center gap-2">
            🔗 Evidence Relationship Graph
          </h3>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-[#fbbf24] hover:bg-[#f59e0b] text-[#0a0b0f] rounded-lg text-sm font-medium transition-all"
          >
            {showForm ? 'Cancel' : '+ Add Node'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleAddNode} className="mb-6 p-4 bg-[#1f2028] rounded-lg border border-[#2e303a]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Node Type
                </label>
                <select
                  value={formData.nodeType}
                  onChange={(e) => setFormData({ ...formData, nodeType: e.target.value })}
                  className="w-full bg-[#16171d] border border-[#2e303a] rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#fbbf24]"
                >
                  <option value="witness">Witness</option>
                  <option value="suspect">Suspect</option>
                  <option value="victim">Victim</option>
                  <option value="evidence">Evidence</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.nodeName}
                  onChange={(e) => setFormData({ ...formData, nodeName: e.target.value })}
                  placeholder="Enter name"
                  required
                  className="w-full bg-[#16171d] border border-[#2e303a] rounded-lg px-3 py-2 text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#fbbf24]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description"
                  className="w-full bg-[#16171d] border border-[#2e303a] rounded-lg px-3 py-2 text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#fbbf24]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-all"
            >
              Add Node
            </button>
          </form>
        )}

        <div className="bg-black/30 rounded-lg overflow-hidden">
          <canvas
            ref={canvasRef}
            width={800}
            height={500}
            className="w-full border border-[#2e303a] rounded-lg"
          />
        </div>
      </div>

      {/* Nodes List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {nodes.map((node) => (
          <div
            key={node._id}
            className={`p-4 rounded-lg border ${getNodeColor(node.nodeType)} cursor-pointer transition-all hover:scale-105`}
            onClick={() => setSelectedNode(selectedNode?._id === node._id ? null : node)}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{getNodeIcon(node.nodeType)}</span>
              <div>
                <h4 className="font-bold">{node.nodeName}</h4>
                <p className="text-xs opacity-75 capitalize">{node.nodeType}</p>
              </div>
            </div>
            {node.description && (
              <p className="text-sm mb-2">{node.description}</p>
            )}
            {node.connections && node.connections.length > 0 && (
              <div className="text-xs opacity-75">
                📊 {node.connections.length} connection{node.connections.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        ))}
      </div>

      {nodes.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p className="mb-4">No nodes yet. Start by adding witnesses, suspects, victims, or evidence.</p>
        </div>
      )}
    </div>
  );
};

export default EvidenceRelationshipGraph;
