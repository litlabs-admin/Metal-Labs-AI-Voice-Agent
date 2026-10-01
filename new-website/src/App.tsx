import React, { useEffect, useRef } from 'react';
import { SITE_HTML } from './siteHtml';
import { initSite } from './site';
import './style.css';

export function App() {
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => { if (ref.current) initSite(ref.current); }, []);
    return <div ref={ref} dangerouslySetInnerHTML={{ __html: SITE_HTML }} />;
}
