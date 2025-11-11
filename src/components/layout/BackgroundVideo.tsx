/**
 * BackgroundVideo Component
 * Sistema background con video MP4 e fallback GIF
 * Ottimizzato per compatibilità e performance
 */

import { useState } from 'react'

export default function BackgroundVideo() {
  const [videoError, setVideoError] = useState(false)

  // Gestione caricamento video
  const handleVideoLoad = () => {
    // Video caricato con successo
  }

  const handleVideoError = () => {
    setVideoError(true)
  }

  // Gestione caricamento GIF fallback
  const handleGifLoad = () => {
    // GIF caricata con successo
  }

  const handleGifError = () => {
    // Errore nel caricamento della GIF
  }

  return (
    <div 
      className="fixed inset-0 w-full h-full -z-10 overflow-hidden"
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1
      }}
    >
      {!videoError ? (
        /* Video MP4 principale */
        <video
          className="w-full h-full object-cover"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: 'scale(0.97)',
            filter: 'brightness(0.95)'
          }}
          autoPlay
          loop
          muted
          playsInline
          poster="/videos/sfondo.gif"
          onLoadedData={handleVideoLoad}
          onCanPlay={handleVideoLoad}
          onError={handleVideoError}
        >
          <source src="/videos/sfondo.mp4" type="video/mp4" />
          <source src="/videos/sfondo2.mp4" type="video/mp4" />
          {/* Fallback automatico se il browser non supporta video */}
          <img 
            src="/videos/sfondo.gif" 
            alt="Video background fallback" 
            className="w-full h-full object-cover"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: 'scale(0.97)',
              filter: 'brightness(0.95)'
            }}
            onLoad={handleGifLoad}
            onError={handleGifError}
          />
        </video>
      ) : (
        /* Fallback GIF se video non supportato */
        <img 
          src="/videos/sfondo.gif" 
          alt="Background fallback" 
          className="w-full h-full object-cover"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: 'scale(0.97)',
            filter: 'brightness(0.95)'
          }}
          onLoad={handleGifLoad}
          onError={handleGifError}
        />
      )}
      
      {/* Overlay sottile per migliorare la leggibilità del testo */}
      <div 
        className="absolute inset-0 bg-black/5 pointer-events-none"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.05)',
          pointerEvents: 'none'
        }}
      />
    </div>
  )
}