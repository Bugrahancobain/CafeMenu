import React, { useState, useEffect } from 'react';
import { database, ref, onValue } from '../firebaseConfig';
import LoadingLogo from "../assets/cafeMenuLogo.webp"
import '../style/MenuPage.css';

const MenuPage = () => {
    const [menu, setMenu] = useState({
        backgroundImageUrl: '',
        backgroundColor: 'white',
        textColor: 'black',
        categories: []
    });
    const [activeCategory, setActiveCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const menuRef = ref(database, 'menu');
        onValue(menuRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setMenu(data);
                setLoading(false);
            }
        }, (error) => {
            console.error('Veriler alınırken bir hata oluştu:', error);
        });
    }, []);

    const handleShowAll = () => {
        setActiveCategory(null);
    };
    if (loading) {
        return (
            <div className="loading-screen">
                <img src={LoadingLogo} alt="Logo" className="loading-logo" />
                <p className="loading-text">Loading...</p>
            </div>
        );
    }
    return (
        <div style={{ backgroundImage: `url(${menu.backgroundImageUrl})`, color: menu.textColor }} loading="lazy" className="menu">
            <main style={{ margin: "20px", padding: "20px", backgroundColor: `${menu.backgroundColor}`, width: "500px" }}>
                <h1>CART CURT CAFE</h1>
                <p className="established">Est. 2024</p>
                <hr />

                <div className="category-list">
                    <button
                        onClick={handleShowAll}
                        className={`category-button ${activeCategory === null ? 'active' : ''}`}
                    >
                        Tümünü Göster
                    </button>
                    {menu.categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => setActiveCategory(category.id)}
                            className={`category-button ${activeCategory === category.id ? 'active' : ''}`}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>


                {menu.categories
                    .filter(category => category.id === activeCategory || activeCategory === null)
                    .map((category) => (
                        <section key={category.id}>
                            <h2>{category.name}</h2>
                            {category.products.map((product) => (
                                <article className="item" key={product.id}>
                                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "start" }}>
                                        <p style={{ textAlign: "start" }}>
                                            {product.name}
                                        </p>
                                        <p style={{ textAlign: "start", fontSize: "13px" }}>
                                            {product.description}
                                        </p>
                                    </div>
                                    <p className="price">{product.price} ₺</p>
                                </article>
                            ))}
                            <hr className="bottom-line" />
                        </section>
                    ))}
            </main>
        </div>
    );
};

export default MenuPage;
