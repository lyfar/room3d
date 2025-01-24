class MouseControl {
    constructor() {
        this.mouseX = 0;
        this.mouseY = 0;
        this.mouseTargetX = 0;
        this.mouseTargetY = 0;
        this.windowWidth = window.innerWidth;
        this.windowHeight = window.innerHeight;
        this.maxMove = 0.15;
        this.inertia = 0.05;
        
        // Bind methods
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.update = this.update.bind(this);
        
        // Start tracking
        this.init();
    }
    
    init() {
        document.addEventListener('mousemove', this.handleMouseMove);
        requestAnimationFrame(this.update);
    }
    
    handleMouseMove(e) {
        const centerX = this.windowWidth/2;
        const centerY = this.windowHeight/2;
        
        // Calculate distance from center as a percentage (0 to 1)
        const distanceX = Math.abs(centerX - e.clientX) / centerX;
        const distanceY = Math.abs(centerY - e.clientY) / centerY;
        
        // Apply exponential falloff for smoother transition
        const falloffX = Math.exp(-distanceX * 3);
        const falloffY = Math.exp(-distanceY * 3);
        
        // Get direction (-1 or 1)
        const directionX = centerX > e.clientX ? 1 : -1;
        const directionY = centerY > e.clientY ? 1 : -1;
        
        // Apply very limited movement range with falloff
        this.mouseTargetX = directionX * falloffX * this.maxMove;
        this.mouseTargetY = directionY * falloffY * this.maxMove;
    }
    
    update() {
        // Smooth transition to target
        this.mouseX += (this.mouseTargetX - this.mouseX) * this.inertia;
        this.mouseY += (this.mouseTargetY - this.mouseY) * this.inertia;
        
        // Update sketch if available
        const sketch = document.querySelector('canvas').__sketch;
        if (sketch) {
            sketch.mouseX = this.mouseX;
            sketch.mouseY = this.mouseY;
            sketch.mouseTargetX = this.mouseTargetX;
            sketch.mouseTargetY = this.mouseTargetY;
        }
        
        requestAnimationFrame(this.update);
    }
} 