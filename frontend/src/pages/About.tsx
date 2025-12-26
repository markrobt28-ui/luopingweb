import { motion } from 'framer-motion';

const About = () => {
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
            关于我们
          </h1>
          
          <div className="max-w-3xl mx-auto space-y-6">
            <p className="text-lg text-text-muted leading-relaxed">
              智捷小工具是一个专注于提供高效实用工具的平台，致力于通过技术创新提升用户的工作和生活效率。
            </p>
            <p className="text-lg text-text-muted leading-relaxed">
              我们精心挑选和开发各类实用工具，涵盖办公效率、生活便利、学习辅助等多个领域，为用户提供一站式的工具解决方案。
            </p>
            <p className="text-lg text-text-muted leading-relaxed">
              我们的使命是让每个人都能轻松找到适合自己的工具，让技术真正服务于生活。
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default About;