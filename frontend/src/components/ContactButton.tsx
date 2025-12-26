const ContactButton = () => {
  return (
    <a
      href="weixin://dl/addfriend?username=LP20241688"
      className="fixed top-1/2 right-8 -translate-y-1/2 w-16 h-16 md:w-[70px] md:h-[70px] rounded-full bg-gradient-to-br from-accent to-primary-gold flex flex-col items-center justify-center text-primary-blue font-bold text-xs cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-[0_0_40px_rgba(100,255,218,0.8)] border-2 border-primary-blue/70 z-50"
    >
      <i className="fas fa-comments text-xl md:text-2xl mb-1"></i>
      <span>咨询</span>
    </a>
  );
};

export default ContactButton;
