document.addEventListener('DOMContentLoaded', function() {
    // Initialize elements
    const colorPreview = document.getElementById('colorPreview');
    const colorInput = document.getElementById('colorInput');
    const redSlider = document.getElementById('redSlider');
    const greenSlider = document.getElementById('greenSlider');
    const blueSlider = document.getElementById('blueSlider');
    const hexValue = document.getElementById('hexValue');
    const rgbValue = document.getElementById('rgbValue');
    const hslValue = document.getElementById('hslValue');
    const cmykValue = document.getElementById('cmykValue');
    const copyBtn = document.getElementById('copyBtn');
    const randomBtn = document.getElementById('randomBtn');
    const monochromaticScheme = document.getElementById('monochromaticScheme');
    const complementaryScheme = document.getElementById('complementaryScheme');
    const analogousScheme = document.getElementById('analogousScheme');
    const triadicScheme = document.getElementById('triadicScheme');

    // Initialize Spectrum color picker
    $("#colorInput").spectrum({
        type: "component",
        showInput: true,
        showInitial: true,
        showAlpha: false,
        showPalette: true,
        showSelectionPalette: true,
        palette: [
            ["#000000", "#444444", "#666666", "#999999", "#cccccc", "#eeeeee", "#f3f3f3", "#ffffff"],
            ["#f00", "#f90", "#ff0", "#0f0", "#0ff", "#00f", "#90f", "#f0f"],
            ["#f4cccc", "#fce5cd", "#fff2cc", "#d9ead3", "#d0e0e3", "#cfe2f3", "#d9d2e9", "#ead1dc"],
            ["#ea9999", "#f9cb9c", "#ffe599", "#b6d7a8", "#a2c4c9", "#9fc5e8", "#b4a7d6", "#d5a6bd"],
            ["#e06666", "#f6b26b", "#ffd966", "#93c47d", "#76a5af", "#6fa8dc", "#8e7cc3", "#c27ba0"],
            ["#c00", "#e69138", "#f1c232", "#6aa84f", "#45818e", "#3d85c6", "#674ea7", "#a64d79"],
            ["#900", "#b45f06", "#bf9000", "#38761d", "#134f5c", "#0b5394", "#351c75", "#741b47"],
            ["#600", "#783f04", "#7f6000", "#274e13", "#0c343d", "#073763", "#20124d", "#4c1130"]
        ],
        change: function(color) {
            updateColor(color.toHexString());
        }
    });

    // Update color based on RGB sliders
    function updateColorFromSliders() {
        const r = redSlider.value;
        const g = greenSlider.value;
        const b = blueSlider.value;
        const hex = rgbToHex(r, g, b);
        updateColor(hex);
    }

    // Convert RGB to HEX
    function rgbToHex(r, g, b) {
        return "#" + [r, g, b].map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? "0" + hex : hex;
        }).join("");
    }

    // Convert HEX to RGB
    function hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    // Convert RGB to HSL
    function rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case g: h = (r - g) / d + 4; break;
            }

            h /= 6;
        }

        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            l: Math.round(l * 100)
        };
    }

    // Convert RGB to CMYK
    function rgbToCmyk(r, g, b) {
        const r1 = r / 255;
        const g1 = g / 255;
        const b1 = b / 255;

        const k = 1 - Math.max(r1, g1, b1);
        const c = (1 - r1 - k) / (1 - k) || 0;
        const m = (1 - g1 - k) / (1 - k) || 0;
        const y = (1 - b1 - k) / (1 - k) || 0;

        return {
            c: Math.round(c * 100),
            m: Math.round(m * 100),
            y: Math.round(y * 100),
            k: Math.round(k * 100)
        };
    }

    // Generate color schemes
    function generateColorSchemes(hex) {
        const rgb = hexToRgb(hex);
        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

        // Monochromatic
        const monoColors = generateMonochromatic(hsl);
        updateSchemePreview(monochromaticScheme, monoColors);

        // Complementary
        const compColors = generateComplementary(hsl);
        updateSchemePreview(complementaryScheme, compColors);

        // Analogous
        const analogColors = generateAnalogous(hsl);
        updateSchemePreview(analogousScheme, analogColors);

        // Triadic
        const triadColors = generateTriadic(hsl);
        updateSchemePreview(triadicScheme, triadColors);
    }

    // Generate monochromatic colors
    function generateMonochromatic(hsl) {
        return [
            hslToHex({ ...hsl, l: Math.max(0, hsl.l - 40) }),
            hslToHex({ ...hsl, l: Math.max(0, hsl.l - 20) }),
            hslToHex(hsl),
            hslToHex({ ...hsl, l: Math.min(100, hsl.l + 20) }),
            hslToHex({ ...hsl, l: Math.min(100, hsl.l + 40) })
        ];
    }

    // Generate complementary colors
    function generateComplementary(hsl) {
        return [
            hslToHex(hsl),
            hslToHex({ ...hsl, h: (hsl.h + 180) % 360 })
        ];
    }

    // Generate analogous colors
    function generateAnalogous(hsl) {
        return [
            hslToHex({ ...hsl, h: (hsl.h - 30 + 360) % 360 }),
            hslToHex(hsl),
            hslToHex({ ...hsl, h: (hsl.h + 30) % 360 })
        ];
    }

    // Generate triadic colors
    function generateTriadic(hsl) {
        return [
            hslToHex(hsl),
            hslToHex({ ...hsl, h: (hsl.h + 120) % 360 }),
            hslToHex({ ...hsl, h: (hsl.h + 240) % 360 })
        ];
    }

    // Convert HSL to HEX
    function hslToHex(hsl) {
        const h = hsl.h / 360;
        const s = hsl.s / 100;
        const l = hsl.l / 100;

        let r, g, b;

        if (s === 0) {
            r = g = b = l;
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };

            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;

            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }

        const toHex = x => {
            const hex = Math.round(x * 255).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };

        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }

    // Update scheme preview
    function updateSchemePreview(container, colors) {
        container.innerHTML = colors.map(color => `
            <div class="color" style="background-color: ${color};" title="${color}"></div>
        `).join('');
    }

    // Update all color values
    function updateColor(hex) {
        const rgb = hexToRgb(hex);
        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
        const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);

        // Update preview
        colorPreview.style.backgroundColor = hex;

        // Update sliders
        redSlider.value = rgb.r;
        greenSlider.value = rgb.g;
        blueSlider.value = rgb.b;

        // Update format values
        hexValue.value = hex;
        rgbValue.value = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        hslValue.value = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
        cmykValue.value = `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`;

        // Generate color schemes
        generateColorSchemes(hex);
    }

    // Event listeners
    redSlider.addEventListener('input', updateColorFromSliders);
    greenSlider.addEventListener('input', updateColorFromSliders);
    blueSlider.addEventListener('input', updateColorFromSliders);

    copyBtn.addEventListener('click', () => {
        const format = document.activeElement.closest('.input-group')?.querySelector('input');
        if (format) {
            navigator.clipboard.writeText(format.value)
                .then(() => {
                    const originalText = copyBtn.innerHTML;
                    copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                    setTimeout(() => {
                        copyBtn.innerHTML = originalText;
                    }, 2000);
                })
                .catch(err => {
                    console.error('Failed to copy text: ', err);
                });
        }
    });

    randomBtn.addEventListener('click', () => {
        const randomHex = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
        updateColor(randomHex);
        $("#colorInput").spectrum("set", randomHex);
    });

    // Initialize with default color
    updateColor("#000000");
}); 