export const generateVideoThumbnail = (file) => {
    return new Promise ((resolve,reject) => {
        const video = document.createElement('video');
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        //----------- video metadata ------------
        video.preload = 'metadata';
        video.muted = true;
        video.src = URL.createObjectURL(file);

        video.addEventListener('loadedmetadata', () => {
            const time = video.duration/2;
            video.currentTime = time;
        });

        video.addEventListener('seeked', ()=> {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            ctx.drawImage(video,0,0,canvas.width, canvas.height);

            const thumbnail = canvas.toDataURL('image/png');
            resolve(thumbnail);

            URL.revokeObjectURL(video.src)
        })

        video.addEventListener('error',(err)=> {
            reject(err)
        })

        video.onerror = (err) => {
            URL.revokeObjectURL(url)
            reject(err)
        }
    })
}

export const getFileCategory = (file) => {
  const name = file.name || "";
  const ext = name.split(".").pop()?.toLowerCase();

  if (["mp4", "webm", "mov", "mkv"].includes(ext)) return "video";
  if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) return "image";
  if(ext === 'pdf') return 'pdf';
  return "raw";
};
