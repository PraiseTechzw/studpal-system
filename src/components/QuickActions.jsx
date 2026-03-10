import { Sparkles, FileText, Upload, Globe, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import './QuickActions.css';

const QuickActions = () => {
  const actions = [
    { icon: <Sparkles size={24} color="#14b8a6" />, title: "Ask AI Assistant", desc: "Get help with your studies", path: "/ai-assistant" },
    { icon: <FileText size={24} color="#3b82f6" />, title: "Create Note", desc: "Write a new text note", path: "/text-notes" },
    { icon: <Upload size={24} color="#f59e0b" />, title: "Upload PDF", desc: "Add a new document", path: "/pdf-documents" },
    { icon: <Globe size={24} color="#8b5cf6" />, title: "Save Link", desc: "Bookmark a web resource", path: "/web-links" },
    { icon: <Users size={24} color="#10b981" />, title: "Join Study Group", desc: "Collaborate with peers", path: "/study-groups" }
  ];

  return (
    <div className="quick-actions-card">
      <div className="actions-header">
        {actions.map((action, idx) => (
          <Link to={action.path} key={idx} className="action-item-link">
            <div className="action-item">
              <div className="action-icon-wrapper">
                {action.icon}
              </div>
              <div className="action-info">
                <h3>{action.title}</h3>
                <p>{action.desc}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
