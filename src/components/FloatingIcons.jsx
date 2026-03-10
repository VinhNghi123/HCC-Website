// FloatingIcons.jsx
// These icons are fixed to the viewport edges so they NEVER overlap page content

const ICONS = [
    // Left column — stacked vertically along the left edge
    { icon: '✨', top: '8%', left: '1%', delay: '0s', size: 36 },
    { icon: '🕹️', top: '22%', left: '0%', delay: '0.8s', size: 40 },
    { icon: '👾', top: '38%', left: '1%', delay: '1.5s', size: 34 },
    { icon: '⚡', top: '55%', left: '0%', delay: '0.4s', size: 32 },
    { icon: '🛡️', top: '70%', left: '1%', delay: '2s', size: 36 },
    { icon: '🍄', top: '85%', left: '0%', delay: '1.1s', size: 30 },

    // Right column — stacked vertically along the right edge
    { icon: '⭐', top: '6%', right: '1%', delay: '0.3s', size: 36 },
    { icon: '💎', top: '20%', right: '0%', delay: '1.3s', size: 34 },
    { icon: '🔥', top: '36%', right: '1%', delay: '0.6s', size: 38 },
    { icon: '🪙', top: '52%', right: '0%', delay: '1.8s', size: 32 },
    { icon: '🧩', top: '67%', right: '1%', delay: '0.9s', size: 36 },
    { icon: '💖', top: '82%', right: '0%', delay: '2.2s', size: 30 },

    // Top row — scattered along the very top
    { icon: '🎮', top: '1%', left: '12%', delay: '0.5s', size: 30 },
    { icon: '👑', top: '1%', left: '30%', delay: '1.6s', size: 32 },
    { icon: '⚔️', top: '1%', left: '62%', delay: '0.2s', size: 28 },
    { icon: '🌟', top: '1%', left: '80%', delay: '1.0s', size: 30 },
]

export default function FloatingIcons() {
    return (
        <>
            {ICONS.map((item, i) => (
                <div
                    key={i}
                    className="float-anim"
                    style={{
                        position: 'fixed',
                        top: item.top,
                        left: item.left,
                        right: item.right,
                        fontSize: item.size,
                        animationDelay: item.delay,
                        opacity: 0.75,
                        pointerEvents: 'none',  // Never blocks any click
                        zIndex: 0,
                        userSelect: 'none',
                    }}
                >
                    {item.icon}
                </div>
            ))}
        </>
    )
}
