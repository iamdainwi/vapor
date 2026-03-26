import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Vapor',
        short_name: 'Vapor',
        description: 'Temporal repository for volatile data leases.',
        start_url: '/dashboard', // Or '/feed' based on your routing
        display: 'standalone',
        background_color: '#09090b', // Tailwind zinc-950
        theme_color: '#09090b',
        orientation: 'portrait',
        icons: [
            {
                src: '/icon-192x192.jpeg',
                sizes: '192x192',
                type: 'image/jpeg',
            },
            {
                src: '/icon-512x512.jpeg',
                sizes: '512x512',
                type: 'image/jpeg',
            },
        ],
    }
}