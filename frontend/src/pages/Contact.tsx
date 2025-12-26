import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { apiRequest } from '../services/api';

interface Settings {
  aboutTitle?: string;
  aboutContent?: string;
  aboutButton1Text?: string;
  aboutButton1Link?: string;
  aboutButton2Text?: string;
  aboutButton2Link?: string;
  aboutButton3Text?: string;
  aboutButton3Link?: string;
}

const Contact = () => {
  const [settings, setSettings] = useState<Settings>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await apiRequest('settings');
      setSettings(data);
    } catch (error) {
      console.error('加载设置失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const title = settings.aboutTitle || '联系我们';
  const content = settings.aboutContent || `我是一名专注于AI和商业化的独立开发者，致力于通过智能小工具提升个人和企业的效率。
拥有多年的开发经验和对市场趋势的敏锐洞察力，我不断探索创新，将前沿技术融入到实际应用中。
我的目标是帮助更多人借助AI的力量，实现个人价值的最大化，并构建可持续的商业模式。`;
  
  const button1Text = settings.aboutButton1Text || '免费咨询';
  const button1Link = settings.aboutButton1Link || 'weixin://dl/addfriend?username=LP20241688';
  const button2Text = settings.aboutButton2Text || '工具下载';
  const button2Link = settings.aboutButton2Link || 'https://pan.quark.cn/s/21e4f8218687';
  const button3Text = settings.aboutButton3Text || '加入社群';
  const button3Link = settings.aboutButton3Link || 'weixin://dl/addfriend?username=LP20241688';

  if (loading) {
    return (
      <div className="pt-24 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="pt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-primary-secondary/40 rounded-3xl py-20 px-8 text-center border border-accent/10 shadow-[0_0_30px_rgba(100,255,218,0.1)] backdrop-blur-sm relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent"></div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-8 gradient-text inline-block relative pb-5 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-24 after:h-1 after:bg-gradient-to-r after:from-accent after:to-primary-gold after:rounded after:shadow-[0_0_10px_#64ffda]">
            {title}
          </h1>
          
          <div className="max-w-3xl mx-auto space-y-6">
            {content.split('\n').map((paragraph, index) => (
              <p key={index} className="text-lg text-text-muted leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-6 mt-12">
            {button1Text && button1Link && (
              <a
                href={button1Link}
                className="px-10 py-4 bg-gradient-to-br from-accent to-accent/80 text-primary-blue rounded-full text-lg font-bold glow-button shadow-[0_0_30px_rgba(100,255,218,0.4)]"
              >
                {button1Text}
              </a>
            )}
            {button2Text && button2Link && (
              <a
                href={button2Link}
                target="_blank"
                rel="noopener noreferrer"
                className="px-10 py-4 bg-gradient-to-br from-primary-gold to-primary-gold/80 text-primary-blue rounded-full text-lg font-bold glow-button shadow-[0_0_30px_rgba(255,215,0,0.4)]"
              >
                {button2Text}
              </a>
            )}
            {button3Text && button3Link && (
              <a
                href={button3Link}
                className="px-10 py-4 bg-gradient-to-br from-purple-400 to-purple-600 text-white rounded-full text-lg font-bold glow-button shadow-[0_0_30px_rgba(168,85,247,0.4)]"
              >
                {button3Text}
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Contact;