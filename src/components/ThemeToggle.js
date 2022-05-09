import { useState, useEffect } from 'react';

export const ThemeToggle = () => { 
    const [isDark, setIsDark] = useState(localStorage.getItem("theme") === "light" ? false : true); 
    useEffect(() => { document.getElementsByTagName("HTML")[0].setAttribute("data-theme", localStorage.getItem("theme")); 
    },[]);

    const toggleThemeChange = () => { 
        if (isDark === false) { 
            localStorage.setItem("theme", "dark"); 
            document.getElementsByTagName("HTML")[0].setAttribute("data-theme",localStorage.getItem("theme")); 
            setIsDark(true); 
        } else { 
            localStorage.setItem("theme", "light"); 
            document.getElementsByTagName("HTML")[0].setAttribute("data-theme",localStorage.getItem("theme")); 
            setIsDark(false); 
        } 
    }

    return ( 
        <button className={`ghost sm theme-${isDark ? 'dark' : 'light'}`} onClick={toggleThemeChange} />
    )
};

export default ThemeToggle;
