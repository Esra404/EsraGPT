import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, GraduationCap, Code, Target, Briefcase, Heart } from 'lucide-react';
import { useProfileStore } from '../../store/useStore';
import { Card } from '../ui/Card';

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileDrawer({ isOpen, onClose }: ProfileDrawerProps) {
  const { profile, isLoading, fetchProfile } = useProfileStore();

  useEffect(() => {
    if (isOpen) {
      fetchProfile();
    }
  }, [isOpen, fetchProfile]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-background border-l border-card-hover/50 z-50 shadow-2xl overflow-y-auto"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-text">Profil</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-card-hover rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-text-secondary" />
                </button>
              </div>

              {/* Content */}
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                </div>
              ) : profile ? (
                <div className="space-y-4">
                  {/* Name Card */}
                  <Card className="bg-gradient-to-br from-primary/20 to-secondary/20 border-primary/30">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                        <span className="text-2xl font-bold text-white">
                          {profile.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-text">{profile.name}</h3>
                        <div className="flex items-center gap-2 text-text-secondary mt-1">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">{profile.city}</span>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Education */}
                  <Card>
                    <div className="flex items-center gap-3 mb-3">
                      <GraduationCap className="w-5 h-5 text-primary" />
                      <h4 className="font-semibold text-text">Eğitim</h4>
                    </div>
                    <p className="text-text">{profile.university}</p>
                    <p className="text-text-secondary text-sm mt-1">{profile.department}</p>
                  </Card>

                  {/* Technical Skills */}
                  <Card>
                    <div className="flex items-center gap-3 mb-3">
                      <Code className="w-5 h-5 text-secondary" />
                      <h4 className="font-semibold text-text">Teknik Yetenekler</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {profile.technical_skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-card-hover rounded-full text-sm text-text"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </Card>

                  {/* Interests */}
                  <Card>
                    <div className="flex items-center gap-3 mb-3">
                      <Heart className="w-5 h-5 text-danger" />
                      <h4 className="font-semibold text-text">İlgi Alanları</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {profile.interests.map((interest, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-card-hover rounded-full text-sm text-text"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </Card>

                  {/* Projects */}
                  <Card>
                    <div className="flex items-center gap-3 mb-3">
                      <Briefcase className="w-5 h-5 text-warning" />
                      <h4 className="font-semibold text-text">Projeler</h4>
                    </div>
                    <ul className="space-y-2">
                      {profile.projects.map((project, index) => (
                        <li key={index} className="text-text text-sm">
                          • {project}
                        </li>
                      ))}
                    </ul>
                  </Card>

                  {/* Goals */}
                  <Card>
                    <div className="flex items-center gap-3 mb-3">
                      <Target className="w-5 h-5 text-success" />
                      <h4 className="font-semibold text-text">Hedefler</h4>
                    </div>
                    <ul className="space-y-2">
                      {profile.goals.map((goal, index) => (
                        <li key={index} className="text-text text-sm">
                          • {goal}
                        </li>
                      ))}
                    </ul>
                  </Card>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-text-secondary">Profil bilgisi bulunamadı</p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
