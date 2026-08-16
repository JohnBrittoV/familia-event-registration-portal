import { useEffect } from 'react';

export const useMouseGlow = () => {
    useEffect(() => {
        const finePointer = window.matchMedia('(pointer: fine)');
        if (!finePointer.matches) return;

        let frame = 0;

        const handlePointerMove = (event) => {
            cancelAnimationFrame(frame);

            frame = requestAnimationFrame(() => {
                document.documentElement.style.setProperty(
                    '--mouse-x',
                    `${event.clientX}px`
                );
                document.documentElement.style.setProperty(
                    '--mouse-y',
                    `${event.clientY}px`
                );
            });
        };

        window.addEventListener('pointermove', handlePointerMove, { passive: true });

        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener('pointermove', handlePointerMove);
        };
    }, []);
};
