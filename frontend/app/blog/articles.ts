
export type Article = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  author: ArticleAuthor;
  category: string;
  content: ArticleSection[];
};

export type ArticleAuthor = {
  name: string;
  role: string;
  company: string;
  bio: string;
  image: string;
};

export const videoDownEditorialTeam: ArticleAuthor = {
  name: "VideoDown Editorial Team",
  role: "Editorial team",
  company: "VideoDown",
  bio: "We publish clear, practical guides to video formats, codecs, and the technology behind online video.",
  image: "/images/authors/arshad-ali.jpg",
};

export type ArticleSection =
  | {
    type: "heading";
    text: string;
  }
  | {
    type: "paragraph";
    text: string;
  }
  | {
    type: "list";
    items: string[];
  }
  | {
    type: "code";
    code: string;
  };

export const articles: Article[] = [
  {
    slug: "what-is-a-video-file-mp3-mp4-mpeg-ffmpeg",
    title:
      "The Complete Guide to Video Files: MP4, MP3, MPEG, FFmpeg & YouTube Downloaders",
    description:
      "Learn what video files are, how audio and video streams work, the difference between MP3, MP4, MPEG and codecs, and how a YouTube downloader uses yt-dlp and FFmpeg.",
    publishedAt: "2026-10-06",
    author: videoDownEditorialTeam,
    category: "Video Technology",

    content: [
      {
        type: "paragraph",
        text:
          "When you download a video from the internet, you may see file types such as MP4, MP3, MPEG and WebM. You may also hear terms such as codec, container, video stream, audio stream and FFmpeg. These terms can seem confusing at first. This article explains these concepts from the beginning and shows how they fit together inside a modern YouTube downloader.",
      },

      {
        type: "heading",
        text: "What Is a Video File?",
      },
      {
        type: "paragraph",
        text:
          "A video is essentially a sequence of images displayed rapidly one after another. For example, a video running at 30 frames per second displays approximately 30 individual frames every second. A ten-second video at 30 frames per second therefore contains about 300 frames.",
      },
      {
        type: "paragraph",
        text:
          "A video also normally contains audio. The audio may include speech, music, sound effects and other sounds. Additional information such as duration, encoding information and other metadata may also be stored with the media.",
      },
      {
        type: "code",
        code: `Video file
├── Video stream
├── Audio stream
└── Metadata`,
      },

      {
        type: "heading",
        text: "Why Does Video Need Compression?",
      },
      {
        type: "paragraph",
        text:
          "Uncompressed video requires a huge amount of storage. A Full HD frame contains 1920 × 1080 pixels, and a video may contain 30 or 60 frames every second. Storing every frame without compression would therefore produce extremely large files.",
      },
      {
        type: "paragraph",
        text:
          "Video compression reduces the amount of data required to store and transmit video. Instead of storing every pixel of every frame independently, compression techniques can describe similarities and changes between frames.",
      },

      {
        type: "heading",
        text: "What Is a Codec?",
      },
      {
        type: "paragraph",
        text:
          "The word codec comes from coder and decoder. A codec is technology used to encode media into a compressed form and decode it again for playback.",
      },
      {
        type: "paragraph",
        text:
          "Common video codecs include H.264, H.265 or HEVC, VP9 and AV1. Common audio codecs include AAC, Opus and MP3.",
      },
      {
        type: "code",
        code: `Raw video
    ↓
Video codec
    ↓
Compressed video`,
      },
      {
        type: "paragraph",
        text:
          "A codec is not the same thing as a container. This distinction is important when understanding MP4 and other media formats.",
      },

      {
        type: "heading",
        text: "What Is a Container?",
      },
      {
        type: "paragraph",
        text:
          "A container is a file format that organizes one or more media streams together. You can think of a container as a box that holds the video stream, audio stream and related metadata.",
      },
      {
        type: "code",
        code: `MP4 container
├── Video stream
├── Audio stream
└── Metadata`,
      },
      {
        type: "paragraph",
        text:
          "Common multimedia containers include MP4, WebM, MKV, AVI and MOV. The container tells a media player how the different streams are organized, but the container itself does not define the exact compression codec used for every stream.",
      },

      {
        type: "heading",
        text: "What Is MP4?",
      },
      {
        type: "paragraph",
        text:
          "MP4 is a widely used multimedia container format. Its usual file extension is .mp4. An MP4 file can contain video, audio and metadata.",
      },
      {
        type: "paragraph",
        text:
          "A common combination is H.264 video with AAC audio inside an MP4 container. This combination is widely supported by web browsers, smartphones, computers, televisions and media players.",
      },
      {
        type: "code",
        code: `MP4
├── H.264 video
└── AAC audio`,
      },

      {
        type: "heading",
        text: "What Is MPEG?",
      },
      {
        type: "paragraph",
        text:
          "MPEG stands for Moving Picture Experts Group. It refers to a family of standards related to digital audio and video. MPEG standards have been used for video compression, audio compression and multimedia systems.",
      },
      {
        type: "paragraph",
        text:
          "MP4 is associated with the MPEG-4 family, but MP4 and MPEG are not the same thing. MPEG is a family of standards, while MP4 is a multimedia container format.",
      },

      {
        type: "heading",
        text: "What Is MP3?",
      },
      {
        type: "paragraph",
        text:
          "MP3 is primarily an audio format. An MP3 file normally contains audio rather than video. It is commonly used for music, speech and other audio content.",
      },
      {
        type: "code",
        code: `MP3
↓
Audio`,
      },
      {
        type: "paragraph",
        text:
          "This makes MP3 fundamentally different from MP4. MP4 is a multimedia container that can contain both video and audio, while MP3 is primarily used for audio.",
      },

      {
        type: "heading",
        text: "Video Streams and Audio Streams",
      },
      {
        type: "paragraph",
        text:
          "Modern online video services do not always provide video and audio as one single file. Video and audio can be delivered as separate streams.",
      },
      {
        type: "code",
        code: `Video stream
└── 1080p video

Audio stream
└── Audio`,
      },
      {
        type: "paragraph",
        text:
          "When separate streams are used, a downloader may need to download both streams and combine them into a final media file.",
      },

      {
        type: "heading",
        text: "Why Can Video and Audio Be Separate?",
      },
      {
        type: "paragraph",
        text:
          "Modern video platforms can use adaptive streaming. Different video qualities and audio streams can be provided independently so that the streaming system can select appropriate media for a device and network connection.",
      },
      {
        type: "code",
        code: `Video
├── 360p
├── 480p
├── 720p
└── 1080p

Audio
├── Lower bitrate
├── Medium bitrate
└── Higher bitrate`,
      },

      {
        type: "heading",
        text: "What Is FFmpeg?",
      },
      {
        type: "paragraph",
        text:
          "FFmpeg is a powerful open-source multimedia framework used for processing audio and video. It can perform operations such as encoding, decoding, conversion, filtering and combining media streams.",
      },
      {
        type: "paragraph",
        text:
          "For example, if a downloader has a video stream and an audio stream, FFmpeg can combine them into a single media container when the streams are compatible with the desired output.",
      },
      {
        type: "code",
        code: `Video stream
      +
Audio stream
      ↓
    FFmpeg
      ↓
Combined MP4`,
      },

      {
        type: "heading",
        text: "What Is Muxing?",
      },
      {
        type: "paragraph",
        text:
          "Muxing means combining multiple media streams into a single container. For example, an H.264 video stream and an AAC audio stream can be placed together inside an MP4 container.",
      },
      {
        type: "code",
        code: `H.264 video
     +
AAC audio
     ↓
   Muxing
     ↓
  video.mp4`,
      },
      {
        type: "paragraph",
        text:
          "The opposite operation is called demuxing, where streams are separated from a container.",
      },

      {
        type: "heading",
        text: "How Does a YouTube Downloader Work?",
      },
      {
        type: "paragraph",
        text:
          "A modern YouTube downloader does more than simply copy a video file. It needs to inspect the available media formats, select the requested quality, download the required streams and, when necessary, combine them into the requested output format.",
      },
      {
        type: "code",
        code: `User
 ↓
Next.js Frontend
 ↓
FastAPI Backend
 ↓
Background Worker
 ↓
yt-dlp
 ↓
YouTube`,
      },

      {
        type: "heading",
        text: "Step 1: The User Provides a YouTube URL",
      },
      {
        type: "paragraph",
        text:
          "The process begins when a user enters a YouTube URL into the downloader. The Next.js frontend sends the URL to the backend API for processing.",
      },

      {
        type: "heading",
        text: "Step 2: The Backend Analyzes the Video",
      },
      {
        type: "paragraph",
        text:
          "The backend uses yt-dlp to inspect the supplied URL and discover information about the video and available formats. This can include the title, duration, thumbnail, available resolutions, formats and media codecs.",
      },

      {
        type: "heading",
        text: "Step 3: The User Selects a Quality",
      },
      {
        type: "paragraph",
        text:
          "The frontend can present available quality options such as 360p, 480p and 720p. The user selects the desired output before starting the download.",
      },

      {
        type: "heading",
        text: "Step 4: A Background Job Is Created",
      },
      {
        type: "paragraph",
        text:
          "Downloading and processing a large video can take time. Instead of keeping an HTTP request busy during the entire operation, the application creates a background job.",
      },
      {
        type: "code",
        code: `FastAPI
   ↓
Create download job
   ↓
Redis
   ↓
Celery Worker`,
      },
      {
        type: "paragraph",
        text:
          "This allows the web request and the long-running download task to have separate responsibilities.",
      },

      {
        type: "heading",
        text: "Step 5: yt-dlp Downloads the Media",
      },
      {
        type: "paragraph",
        text:
          "The Celery worker uses yt-dlp to retrieve the selected media. Depending on the available formats, the required video and audio streams may be downloaded separately.",
      },

      {
        type: "heading",
        text: "Step 6: FFmpeg Combines the Streams",
      },
      {
        type: "paragraph",
        text:
          "When separate streams are required, yt-dlp can use FFmpeg to combine them into the requested output container. For an MP4 download, the final file can contain the selected video and audio streams together.",
      },
      {
        type: "code",
        code: `720p video
     +
Audio
     ↓
  FFmpeg
     ↓
Final MP4`,
      },

      {
        type: "heading",
        text: "Step 7: The Download Job Is Updated",
      },
      {
        type: "paragraph",
        text:
          "The background worker updates the download job as the operation progresses. A simplified job lifecycle is:",
      },
      {
        type: "code",
        code: `PENDING
   ↓
PROCESSING
   ↓
COMPLETED`,
      },
      {
        type: "paragraph",
        text:
          "If an error occurs, the job can instead move to a FAILED state.",
      },

      {
        type: "heading",
        text: "Step 8: The User Receives the Final File",
      },
      {
        type: "paragraph",
        text:
          "Once processing is complete, the final media file is made available to the user. The browser can then download the completed file.",
      },

      {
        type: "heading",
        text: "Where Does PostgreSQL Fit?",
      },
      {
        type: "paragraph",
        text:
          "PostgreSQL is used to store information about download jobs rather than storing the video itself. A job record can contain information such as the job ID, task ID, URL, selected format, status, file path, error information and timestamps.",
      },
      {
        type: "code",
        code: `PostgreSQL
└── Download job information

Redis
└── Task/message communication

Celery
└── Background task execution

yt-dlp
└── Media retrieval

FFmpeg
└── Media processing

File storage
└── Downloaded media file`,
      },

      {
        type: "heading",
        text: "MP3, MP4, MPEG and FFmpeg: The Difference",
      },
      {
        type: "list",
        items: [
          "MP3 is primarily an audio format.",
          "MP4 is a multimedia container format.",
          "MPEG is a family of multimedia standards.",
          "FFmpeg is software used to process audio and video.",
        ],
      },

      {
        type: "heading",
        text: "What Actually Happens When You Download an MP4?",
      },
      {
        type: "paragraph",
        text:
          "When a user selects Download as MP4, the source does not necessarily provide one ready-made MP4 file containing everything required. The downloader may need to discover the available streams, select the appropriate video and audio, download them and combine them into an MP4 container.",
      },
      {
        type: "code",
        code: `Discover
   ↓
Select
   ↓
Download
   ↓
Combine / Mux
   ↓
Store
   ↓
Deliver`,
      },

      {
        type: "heading",
        text: "The Complete Architecture",
      },
      {
        type: "paragraph",
        text:
          "The complete downloader architecture can be summarized as a set of separate components, with each component responsible for a specific part of the process.",
      },
      {
        type: "code",
        code: `User
  ↓
Next.js Frontend
  ↓
FastAPI Backend
  ↓
Redis
  ↓
Celery Worker
  ↓
yt-dlp
  ↓
YouTube
  ├── Video stream
  └── Audio stream
          ↓
       FFmpeg
          ↓
      Final MP4
          ↓
       Storage
          ↓
        User`,
      },

      {
        type: "heading",
        text: "Final Takeaway",
      },
      {
        type: "paragraph",
        text:
          "A video file is more than a collection of images. Modern video commonly consists of compressed audio and video streams organized inside a container. Understanding the difference between codecs, containers, streams and multimedia tools makes it much easier to understand how online video platforms and downloaders work.",
      },
      {
        type: "paragraph",
        text:
          "Our YouTube downloader follows this same basic process. The Next.js frontend provides the user interface, FastAPI manages API requests, Redis and Celery handle background jobs, yt-dlp retrieves the available media streams, and FFmpeg can combine compatible streams into the final downloadable file.",
      },
      {
        type: "paragraph",
        text:
          "Instead of thinking that a downloader simply copies a YouTube video, it is more accurate to think of it as a system that discovers available media streams, selects the requested quality, downloads the required streams, combines them when necessary, creates the final media file and delivers it to the user.",
      },
    ],
  },

  {
    slug: "what-is-a-video-codec-h264-h265-vp9-av1",
    title: "What Is a Video Codec? H.264, H.265, VP9, and AV1 Explained",
    description:
      "Understand what video codecs are, how H.264, H.265, VP9, and AV1 work, and why codecs matter when downloading and converting online videos.",
    publishedAt: "2026-10-06",
    author: videoDownEditorialTeam,
    category: "Video Technology",
    content: [
      {
        type: "paragraph",
        text:
          "When you download or watch a video online, you are not simply dealing with a file called MP4 or WebM. Inside that file are encoded video and audio streams. The technology responsible for compressing and encoding the video stream is called a codec. Understanding codecs helps explain why two videos with the same resolution can have very different file sizes, quality, and compatibility.",
      },

      {
        type: "heading",
        text: "What Is a Video Codec?",
      },

      {
        type: "paragraph",
        text:
          "A codec is a technology used to encode and decode digital media. The word codec comes from the combination of coder and decoder. A video codec takes raw or uncompressed video and compresses it into a much smaller representation that can be stored or transmitted. When the video is played, a compatible decoder reconstructs the frames so they can be displayed.",
      },

      {
        type: "paragraph",
        text:
          "Raw video contains an enormous amount of data because every frame contains information about millions of pixels. Storing or transmitting raw video would require far more storage and network bandwidth than most users have available. Video codecs solve this problem by removing redundancy and representing the visual information more efficiently.",
      },

      {
        type: "heading",
        text: "Codec vs Container",
      },

      {
        type: "paragraph",
        text:
          "A codec and a container are not the same thing. A codec describes how the audio or video stream is encoded, while a container is the file format that holds those streams together along with metadata and other information.",
      },

      {
        type: "list",
        items: [
          "H.264 is a video codec.",
          "H.265 (HEVC) is a video codec.",
          "VP9 is a video codec.",
          "AV1 is a video codec.",
          "MP4 is a container format.",
          "WebM is a container format.",
          "MKV is a container format.",
        ],
      },

      {
        type: "paragraph",
        text:
          "For example, an MP4 file may contain an H.264 video stream and an AAC audio stream. The MP4 container packages those streams into one file, while H.264 and AAC describe how the actual video and audio data are encoded.",
      },

      {
        type: "heading",
        text: "What Is H.264?",
      },

      {
        type: "paragraph",
        text:
          "H.264, also known as AVC (Advanced Video Coding), is one of the most widely supported video codecs. It provides a good balance between video quality, compression efficiency, processing requirements, and device compatibility.",
      },

      {
        type: "paragraph",
        text:
          "Because of its broad compatibility, H.264 is commonly used for web video, streaming services, video conferencing, cameras, mobile devices, and downloaded video files. If you need a video that works on a wide range of devices and software, H.264 is often a practical choice.",
      },

      {
        type: "heading",
        text: "What Is H.265?",
      },

      {
        type: "paragraph",
        text:
          "H.265, also called HEVC (High Efficiency Video Coding), was designed to provide better compression efficiency than H.264. At a similar visual quality, H.265 can often produce a smaller file than H.264.",
      },

      {
        type: "paragraph",
        text:
          "The advantage of better compression becomes especially important for high-resolution video such as 4K. However, H.265 generally requires more processing power than H.264, and compatibility can vary between older devices, browsers, and software.",
      },

      {
        type: "heading",
        text: "What Is VP9?",
      },

      {
        type: "paragraph",
        text:
          "VP9 is a video codec developed by Google. It was designed as a royalty-free alternative for efficient video compression and became widely associated with web video and streaming.",
      },

      {
        type: "paragraph",
        text:
          "VP9 can provide efficient compression at high resolutions and is supported by many modern browsers and devices. Online video platforms may use VP9 when delivering video streams to compatible clients.",
      },

      {
        type: "heading",
        text: "What Is AV1?",
      },

      {
        type: "paragraph",
        text:
          "AV1 is a modern, royalty-free video codec developed by the Alliance for Open Media. It was designed to provide high compression efficiency for modern internet video delivery.",
      },

      {
        type: "paragraph",
        text:
          "AV1 can achieve very efficient compression, which can reduce bandwidth requirements while maintaining good visual quality. The trade-off is that encoding and decoding can require significant computational resources, although hardware support for AV1 has been increasing in newer devices.",
      },

      {
        type: "heading",
        text: "Why Does Codec Matter for File Size?",
      },

      {
        type: "paragraph",
        text:
          "Resolution alone does not determine the size of a video file. Two 1080p videos can have significantly different file sizes because they may use different codecs, bitrates, frame rates, audio settings, and compression parameters.",
      },

      {
        type: "list",
        items: [
          "Resolution determines the number of pixels in each frame.",
          "Frame rate determines how many frames are displayed each second.",
          "Codec determines how the video data is compressed and represented.",
          "Bitrate determines how much data is allocated to the video over time.",
          "Audio codec and bitrate contribute to the final file size.",
          "Container format packages the streams into the final file.",
        ],
      },

      {
        type: "heading",
        text: "Why YouTube May Have Multiple Video Formats",
      },

      {
        type: "paragraph",
        text:
          "Modern online video platforms often use adaptive streaming. Instead of providing one large file containing every possible quality, the platform can store and deliver separate audio and video streams at different resolutions and encoding formats.",
      },

      {
        type: "paragraph",
        text:
          "For example, a platform may provide several video streams such as 360p, 480p, 720p, and 1080p. These streams may use different codecs or bitrates. The client can select an appropriate stream depending on the device, connection, and requested quality.",
      },

      {
        type: "heading",
        text: "How Codecs Relate to a YouTube Downloader",
      },

      {
        type: "paragraph",
        text:
          "A YouTube downloader needs to understand the available media formats before it can create the requested output. Tools such as yt-dlp can inspect the available streams and provide information about their resolution, codec, container, bitrate, and other properties.",
      },

      {
        type: "paragraph",
        text:
          "The downloader can then select an appropriate video stream and audio stream. If the selected streams are already suitable for the requested output, they may be combined into a container. If they need to be converted or processed, FFmpeg can perform the required media operations.",
      },

      {
        type: "code",
        code:
          "YouTube\n  │\n  ├── Video stream\n  │     ├── 1080p\n  │     ├── 720p\n  │     └── 480p\n  │\n  └── Audio stream\n        └── Audio codec\n\n        ↓\n\n      yt-dlp\n        ↓\n\n      FFmpeg\n        ↓\n\n   MP4 / final file",
      },

      {
        type: "heading",
        text: "Codec Conversion vs Muxing",
      },

      {
        type: "paragraph",
        text:
          "It is important to distinguish between converting a codec and muxing streams. Muxing means putting existing audio and video streams together inside a container without necessarily re-encoding them. Re-encoding means decoding the original stream and encoding it again using another codec or set of parameters.",
      },

      {
        type: "paragraph",
        text:
          "Muxing is generally much faster because the actual audio and video data does not need to be recompressed. Re-encoding can take considerably longer and may require substantial CPU resources.",
      },

      {
        type: "heading",
        text: "Which Codec Is Best?",
      },

      {
        type: "paragraph",
        text:
          "There is no single codec that is best for every situation. The right choice depends on the desired quality, file size, device compatibility, encoding speed, decoding capability, and intended use.",
      },

      {
        type: "list",
        items: [
          "H.264: excellent compatibility and a practical general-purpose choice.",
          "H.265: better compression efficiency, especially useful for high-resolution video.",
          "VP9: efficient web-oriented codec with broad modern browser support.",
          "AV1: modern and highly efficient, but encoding can be computationally demanding.",
        ],
      },

      {
        type: "heading",
        text: "The Bigger Picture",
      },

      {
        type: "paragraph",
        text:
          "A video file is the result of several technologies working together. The codec determines how the media is encoded, the container packages the streams, the bitrate affects the amount of data used, and tools such as FFmpeg can process, convert, and combine those streams.",
      },

      {
        type: "paragraph",
        text:
          "Understanding these concepts makes it easier to understand what happens when an online video downloader analyzes a URL, selects a quality, retrieves separate media streams, and produces a final downloadable file.",
      },
    ],
  },
];

export function getArticleReadingTime(article: Article) {
  const wordCount = article.content.reduce((total, section) => {
    const text =
      section.type === "list"
        ? section.items.join(" ")
        : section.type === "code"
          ? section.code
          : section.text;

    return total + text.trim().split(/\s+/).filter(Boolean).length;
  }, 0);

  return Math.max(1, Math.ceil(wordCount / 220));
}
