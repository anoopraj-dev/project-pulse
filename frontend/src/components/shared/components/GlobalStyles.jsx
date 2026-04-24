
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600;700&display=swap');

    .h-root { font-family: 'DM Sans', sans-serif; }
    .h-serif { font-family: Georgia, serif; }
    .h-lift { transition: transform .3s ease, box-shadow .3s ease; }
    .h-lift:hover { transform: translateY(-5px); box-shadow: 0 16px 44px rgba(0,150,199,.13); }
  `}</style>
);

export default GlobalStyles;

