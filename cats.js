// --- CAT PHYSICS WORLD ---
// Sử dụng Matter.js để tạo hiệu ứng vật lý rơi tự do và va chạm

const CatPhysics = (() => {
    // Module aliases
    const Engine = Matter.Engine,
        Render = Matter.Render,
        Runner = Matter.Runner,
        Bodies = Matter.Bodies,
        Composite = Matter.Composite,
        Events = Matter.Events,
        Mouse = Matter.Mouse,
        MouseConstraint = Matter.MouseConstraint,
        Body = Matter.Body;

    let engine, render, runner;
    let canvas;
    const catBodies = [];

    // Các hình ảnh mèo (URL thật hoặc Base64)
    const catSprites = [
        'https://cdn-icons-png.flaticon.com/512/616/616408.png', // Mèo đen
        'https://cdn-icons-png.flaticon.com/512/616/616430.png', // Mèo vàng
        'https://cdn-icons-png.flaticon.com/512/616/616554.png', // Mèo trắng
        'https://cdn-icons-png.flaticon.com/512/1998/1998627.png' // Mèo mập
    ];

    function init() {
        // 1. Setup Engine
        engine = Engine.create();
        engine.world.gravity.y = 1; // Trọng lực hướng xuống

        // 2. Setup Render (Canvas phủ lên trên toàn bộ web)
        canvas = document.createElement('canvas');
        canvas.id = 'cat-canvas';
        document.body.appendChild(canvas);

        // Style cho canvas (trong suốt, không chặn chuột hoàn toàn để click link được)
        // Tuy nhiên để tương tác vật lý thì cần logic chuột riêng
        Object.assign(canvas.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            zIndex: '9998', // Dưới con trỏ chuột custom (9999) nhưng trên nội dung
            pointerEvents: 'none', // QUAN TRỌNG: Để click xuyên qua được canvas vào web
            background: 'transparent'
        });

        render = Render.create({
            element: document.body,
            canvas: canvas,
            engine: engine,
            options: {
                width: window.innerWidth,
                height: window.innerHeight,
                background: 'transparent',
                wireframes: false, // Hiển thị texture ảnh
                pixelRatio: window.devicePixelRatio
            }
        });

        // 3. Tạo Sàn nhà & Vật cản (Map từ DOM)
        createEnvironment();

        // 4. Input Chuột (Để tương tác đẩy mèo)
        // Vì canvas để pointer-events: none, ta phải feed dữ liệu chuột thủ công hoặc dùng MouseConstraint đặc biệt
        // Cách tốt nhất: Tạo một Body tròn vô hình đi theo chuột thật
        const mouseBody = Bodies.circle(0, 0, 30, {
            isStatic: true,
            render: { visible: false }
        });
        Composite.add(engine.world, mouseBody);

        document.addEventListener('mousemove', (e) => {
            Body.setPosition(mouseBody, { x: e.clientX, y: e.clientY });
        });

        // 5. Spawn Mèo ban đầu
        for (let i = 0; i < 5; i++) {
            spawnCat();
        }

        // Tự động spawn thêm mèo mỗi 5 giây
        setInterval(spawnCat, 5000);

        // 6. Run
        Render.run(render);
        runner = Runner.create();
        Runner.run(runner, engine);

        // Xử lý resize window
        window.addEventListener('resize', handleResize);
    }

    function createEnvironment() {
        // Xóa vật cản cũ (nếu có)
        const bodies = Composite.allBodies(engine.world);
        bodies.forEach(body => {
            if (body.isStatic && body.label === 'wall') {
                Composite.remove(engine.world, body);
            }
        });

        const width = window.innerWidth;
        const height = window.innerHeight;

        // Tường bao quanh (để mèo không bay ra ngoài màn hình ngang)
        const walls = [
            Bodies.rectangle(width / 2, height + 50, width, 100, { isStatic: true, label: 'ground' }), // Sàn đáy (ẩn)
            Bodies.rectangle(-50, height / 2, 100, height * 5, { isStatic: true, label: 'wall' }), // Tường trái
            Bodies.rectangle(width + 50, height / 2, 100, height * 5, { isStatic: true, label: 'wall' }) // Tường phải
        ];

        // Map các phần tử HTML thành vật cản vật lý
        // Chỉ chọn những khối lớn: Cards, Headers, Navbar
        const mapElements = document.querySelectorAll('.header, .about-card, .blog-card, .btn-primary, .hero-image-wrapper');

        mapElements.forEach(el => {
            const rect = el.getBoundingClientRect();

            // Chỉ tạo vật cản nếu phần tử đang hiển thị trong viewport
            // Lưu ý: Canvas toạ độ là Fixed (theo màn hình), nên rect là chuẩn
            if (rect.width > 0 && rect.height > 0) {
                const body = Bodies.rectangle(
                    rect.left + rect.width / 2,
                    rect.top + rect.height / 2,
                    rect.width,
                    rect.height,
                    {
                        isStatic: true,
                        label: 'wall',
                        render: {
                            visible: false // Ẩn đi, chỉ cần va chạm
                            // fillStyle: 'rgba(255, 0, 0, 0.2)' // Bật cái này để debug xem vị trí
                        },
                        chamfer: { radius: 10 } // Bo góc cho mượt
                    }
                );
                walls.push(body);
            }
        });

        Composite.add(engine.world, walls);
    }

    function spawnCat() {
        if (catBodies.length > 15) return; // Giới hạn số lượng mèo để không lag

        const width = window.innerWidth;
        const size = 40 + Math.random() * 30; // Kích thước ngẫu nhiên 40-70px
        const x = Math.random() * (width - 100) + 50;
        const y = -100; // Rơi từ trên nóc

        const texture = catSprites[Math.floor(Math.random() * catSprites.length)];

        const cat = Bodies.circle(x, y, size / 2, {
            restitution: 0.6, // Độ nảy
            friction: 0.05, // Ma sát thấp để dễ trượt
            density: 0.005, // Nhẹ
            render: {
                sprite: {
                    texture: texture,
                    xScale: size / 512, // Scale ảnh gốc (512px) về size mong muốn
                    yScale: size / 512
                }
            }
        });

        // Random vận tốc đầu để bay tứ tung
        Body.setVelocity(cat, { x: (Math.random() - 0.5) * 10, y: 0 });
        Body.setAngularVelocity(cat, (Math.random() - 0.5) * 0.2);

        catBodies.push(cat);
        Composite.add(engine.world, cat);

        // Remove mèo khi rơi quá sâu (reset bộ nhớ)
        // Matter.js không tự xóa, ta phải check
    }

    // Loop check vị trí để xóa mèo rơi khỏi màn hình hoặc cập nhật vị trí vật cản khi cuộn
    // Vì trang web cuộn (scroll), tọa độ của các phần tử HTML thay đổi so với Viewport
    // Chúng ta cần cập nhật vật cản tĩnh liên tục!

    // update: Matter.js Render dùng viewport cố định. 
    // Khi cuộn trang, element HTML chạy lên trên. Body vật lý cũng phải chạy theo.
    let lastScrollY = window.scrollY;

    document.addEventListener('scroll', () => {
        const deltaY = window.scrollY - lastScrollY;
        lastScrollY = window.scrollY;

        // Dịch chuyển tất cả vật cản STATIC lên/xuống theo scroll
        const bodies = Composite.allBodies(engine.world);
        bodies.forEach(body => {
            if (body.isStatic && body.label === 'wall') {
                Body.translate(body, { x: 0, y: -deltaY });
            }
        });
    });

    // Xử lý khi mèo rơi xuống đáy -> "bay màu" hoặc respawn?
    Events.on(engine, 'beforeUpdate', () => {
        const bodies = Composite.allBodies(engine.world);
        bodies.forEach(body => {
            if (!body.isStatic && body.position.y > window.innerHeight + 100) {
                // Mèo rơi xuống quá đáy màn hình
                // Reset vị trí lên đầu (tạo vòng lặp vô tận) hoặc xóa
                Body.setPosition(body, {
                    x: Math.random() * window.innerWidth,
                    y: -100
                });
                Body.setVelocity(body, { x: 0, y: 0 });
            }
        });
    });

    function handleResize() {
        render.canvas.width = window.innerWidth;
        render.canvas.height = window.innerHeight;
        // Re-create environment
        createEnvironment();
    }

    return { init };
})();

// Khởi chạy khi web load xong
document.addEventListener('DOMContentLoaded', () => {
    // Đợi 1 chút cho layout ổn định
    setTimeout(CatPhysics.init, 1000);
});
