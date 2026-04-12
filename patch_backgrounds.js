const fs = require('fs');
const files = [
  'app/components/StorySection.jsx',
  'app/components/Gallery.jsx', 
  'app/components/RSVPSection.jsx',
  'app/components/EventDetails.jsx',
  'app/components/Footer.jsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Add isVideo helper if not exists
  if (!content.includes('const isVideo =')) {
    content = content.replace(/(export default function \w+\(.*\) \{)/, "$1\n  const isVideo = (url) => url?.match(/\\.(webm|mp4)$/i);");
  }

  // Find the block {config.sectionBackgrounds?.<section> && (
  // We'll replace the inner <div> with a conditional
  const regex = /(\{config\.sectionBackgrounds\?\.([a-zA-Z]+)\s*&&\s*\(\s*)(<div[^>]*className="[^"]*absolute inset-0 pointer-events-none z-0[^"]*"[^>]*style=\{\{\s*backgroundImage:\s*`url\(\$\{config\.sectionBackgrounds\.[a-zA-Z]+\}\)`[^}]*\}\}\s*\/>)(\s*\))/g;
  
  content = content.replace(regex, (match, prefix, sectionName, oldDiv, suffix) => {
    return prefix + `
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          {isVideo(config.sectionBackgrounds.${sectionName}) ? (
            <video 
              src={config.sectionBackgrounds.${sectionName}}
              autoPlay loop muted playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-15"
            />
          ) : (
            ${oldDiv.replace('absolute inset-0 pointer-events-none z-0', 'absolute inset-0 w-full h-full').trim()}
          )}
        </div>
    `.trim() + suffix;
  });

  fs.writeFileSync(file, content);
});
console.log('Done');
