import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { database, ref, onValue, set } from '../firebaseConfig';
import "../style/AdminPanel.css"

const AdminPanel = () => {
    const [menu, setMenu] = useState({
        backgroundImageUrl: '',
        backgroundColor: '',
        textColor: '',
        categories: []
    });
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newProduct, setNewProduct] = useState({ name: '', price: '', description: '' });
    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [editCategory, setEditCategory] = useState(null);
    const [editProduct, setEditProduct] = useState(null);
    const navigate = useNavigate();
    const domain = window.location.hostname;

    useEffect(() => {
        const menuRef = ref(database, 'menu');
        onValue(menuRef, (snapshot) => {
            const data = snapshot.val();
            if (data && Array.isArray(data.categories)) {
                setMenu(data);
            } else {
                console.error('Geçersiz veri formatı:', data);
                setMenu({
                    backgroundImageUrl: '',
                    backgroundColor: 'white',
                    textColor: 'black',
                    categories: []
                });
            }
        }, (error) => {
            console.error('Veriler alınırken bir hata oluştu:', error);
        });
    }, []);

    const renderProducts = (products) => {
        return products.map((item) => {
            if (item.products) {
                return (
                    <div key={item.id}>
                        <h3>{item.name}</h3>
                        <ul>
                            {renderProducts(item.products)}
                        </ul>
                    </div>
                );
            } else {
                return (
                    <li key={item.id}>
                        {item.name} - {item.price}₺ - {item.description}
                    </li>
                );
            }
        });
    };

    const handleBackgroundImageChange = (url) => {
        setMenu(prevMenu => ({ ...prevMenu, backgroundImageUrl: url }));
    };

    const handleBackgroundColorChange = (color) => {
        setMenu(prevMenu => ({ ...prevMenu, backgroundColor: color }));
    };

    const handleTextColorChange = (color) => {
        setMenu(prevMenu => ({ ...prevMenu, textColor: color }));
    };

    const handleCategoryChange = (event) => {
        setNewCategoryName(event.target.value);
    };

    const addCategory = () => {
        const newCategory = {
            id: Date.now().toString(),
            name: newCategoryName,
            products: []
        };
        setMenu(prevMenu => ({
            ...prevMenu,
            categories: [...prevMenu.categories, newCategory]
        }));
        setNewCategoryName('');
    };

    const handleProductChange = (event) => {
        const { name, value } = event.target;
        setNewProduct(prevProduct => ({ ...prevProduct, [name]: value }));
    };

    const handleCategorySelectChange = (event) => {
        setSelectedCategoryId(event.target.value);
    };

    const addProduct = () => {
        if (!selectedCategoryId) {
            alert('Bir kategori seçmelisiniz.');
            return;
        }
        const updatedCategories = menu.categories.map(category => {
            if (category.id === selectedCategoryId) {
                return {
                    ...category,
                    products: [...category.products, { ...newProduct, id: Date.now().toString() }]
                };
            }
            return category;
        });
        setMenu(prevMenu => ({ ...prevMenu, categories: updatedCategories }));
        setNewProduct({ name: '', price: '', description: '' });
        setSelectedCategoryId('');
    };

    const handleCategoryEditChange = (event) => {
        setEditCategory({ ...editCategory, name: event.target.value });
    };

    const handleProductEditChange = (event) => {
        setEditProduct({ ...editProduct, [event.target.name]: event.target.value });
    };

    const startEditCategory = (category) => {
        setEditCategory(category);
    };

    const startEditProduct = (product) => {
        setEditProduct(product);
    };

    const saveCategoryEdit = () => {
        const updatedCategories = menu.categories.map(category => {
            if (category.id === editCategory.id) {
                return editCategory;
            }
            return category;
        });
        setMenu(prevMenu => ({ ...prevMenu, categories: updatedCategories }));
        setEditCategory(null);
    };

    const saveProductEdit = (categoryId) => {
        const updatedCategories = menu.categories.map(category => {
            if (category.id === categoryId) {
                return {
                    ...category,
                    products: category.products.map(product => {
                        if (product.id === editProduct.id) {
                            return editProduct;
                        }
                        return product;
                    })
                };
            }
            return category;
        });
        setMenu(prevMenu => ({ ...prevMenu, categories: updatedCategories }));
        setEditProduct(null);
    };

    const removeCategory = (id) => {
        setMenu(prevMenu => ({
            ...prevMenu,
            categories: prevMenu.categories.filter(category => category.id !== id)
        }));
    };

    const removeProduct = (categoryId, productId) => {
        const updatedCategories = menu.categories.map(category => {
            if (category.id === categoryId) {
                return {
                    ...category,
                    products: category.products.filter(product => product.id !== productId)
                };
            }
            return category;
        });
        setMenu(prevMenu => ({ ...prevMenu, categories: updatedCategories }));
    };

    const handleDragEnd = (result) => {
        const { source, destination, type } = result;

        if (!destination) return;

        if (type === 'CATEGORY') {
            const reorderedCategories = Array.from(menu.categories);
            const [movedCategory] = reorderedCategories.splice(source.index, 1);
            reorderedCategories.splice(destination.index, 0, movedCategory);
            setMenu(prevMenu => ({ ...prevMenu, categories: reorderedCategories }));
        } else if (type === 'PRODUCT') {
            const updatedCategories = menu.categories.map(category => {
                if (category.id === source.droppableId) {
                    const reorderedProducts = Array.from(category.products);
                    const [movedProduct] = reorderedProducts.splice(source.index, 1);
                    reorderedProducts.splice(destination.index, 0, movedProduct);
                    return { ...category, products: reorderedProducts };
                }
                return category;
            });
            setMenu(prevMenu => ({ ...prevMenu, categories: updatedCategories }));
        }
    };

    const saveMenu = () => {
        const menuRef = ref(database, 'menu');
        set(menuRef, menu)
            .then(() => {
                alert('Menu başarıyla kaydedildi!');
            })
            .catch((error) => {
                console.error('Menü kaydedilirken bir hata oluştu:', error);
            });
    };
    const handleLogout = () => {
        navigate('/login');
    };
    const goToMenuPage = () => {
        navigate('/');
    };
    const qrCodeRef = React.useRef();

    const downloadQRCode = (format) => {
        const svgElement = qrCodeRef.current;
        const svgData = new XMLSerializer().serializeToString(svgElement);
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const svgUrl = URL.createObjectURL(svgBlob);

        if (format === 'svg') {
            const link = document.createElement('a');
            link.href = svgUrl;
            link.download = 'qrcode.svg';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();

            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                const imageURL = canvas.toDataURL(`image/${format}`);
                const link = document.createElement('a');
                link.href = imageURL;
                link.download = `qrcode.${format}`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            };

            img.src = svgUrl;
        }
    };
    return (
        <div className="admin-panel">
            <div className="menu-settings">
                <h2>Menu Ayarları</h2>
                <div>
                    <label>
                        Arka Plan Resmi URL:
                        <input type="text" onChange={(e) => handleBackgroundImageChange(e.target.value)} value={menu.backgroundImageUrl} placeholder='https://www.example.com' />
                    </label>
                </div>
                <div>
                    <label>
                        Arka Plan Rengi:
                        <input type="text" onChange={(e) => handleBackgroundColorChange(e.target.value)} value={menu.backgroundColor} placeholder='rgba(0, 0, 0,1)' />
                    </label>
                </div>
                <div>
                    <label>
                        Metin Rengi:
                        <input type="text" onChange={(e) => handleTextColorChange(e.target.value)} value={menu.textColor} placeholder='rgba(0, 0, 0,1)' />
                    </label>
                </div>
            </div>

            <div className="category-management">
                <h2>Kategori Yönetimi</h2>
                <input type="text" value={newCategoryName} onChange={handleCategoryChange} placeholder="Yeni kategori adı" />
                <button onClick={addCategory}>Kategori Ekle</button>

                <div className="product-management">
                    <h2>Ürün Yönetimi</h2>
                    <div>
                        <label>
                            Ürün Adı:
                            <input placeholder='Ürün Adı Giriniz' type="text" name="name" value={newProduct.name} onChange={handleProductChange} />
                        </label>
                    </div>
                    <div>
                        <label>
                            Fiyat:
                            <input placeholder='Fiyat Giriniz' type="text" name="price" value={newProduct.price} onChange={handleProductChange} />
                        </label>
                    </div>
                    <div>
                        <label>
                            Açıklama:
                            <input placeholder='Açıklama Giriniz' type="text" name="description" value={newProduct.description} onChange={handleProductChange} />
                        </label>
                    </div>
                    <div>
                        <label>
                            Kategori Seç:
                            <select value={selectedCategoryId} onChange={handleCategorySelectChange}>
                                <option value="">Kategori Seçin</option>
                                {menu.categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>
                    <button onClick={addProduct}>Ürün Ekle</button>
                </div>
                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="categories" type="CATEGORY">
                        {(provided) => (
                            <ul ref={provided.innerRef} {...provided.droppableProps}>
                                {Array.isArray(menu.categories) && menu.categories.map((category, index) => (
                                    <Draggable key={category.id} draggableId={category.id} index={index}>
                                        {(provided) => (
                                            <li className='categoriesNameDiv' ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                <div>
                                                    {editCategory && editCategory.id === category.id ? (
                                                        <input type="text" value={editCategory.name} onChange={handleCategoryEditChange} />
                                                    ) : (
                                                        <div>
                                                            <span>{category.name}</span>
                                                        </div>
                                                    )}
                                                    {editCategory && editCategory.id === category.id ? (
                                                        <button onClick={saveCategoryEdit}>Kaydet</button>
                                                    ) : (
                                                        <button onClick={() => startEditCategory(category)}>Katagoriyi Düzenle</button>
                                                    )}
                                                    <button style={{ backgroundColor: "red" }} onClick={() => removeCategory(category.id)}>Sil</button>
                                                    <Droppable droppableId={category.id} type="PRODUCT">
                                                        {(provided) => (
                                                            <ul ref={provided.innerRef} {...provided.droppableProps}>
                                                                {category.products.map((product, index) => (
                                                                    <Draggable key={product.id} draggableId={product.id} index={index}>
                                                                        {(provided) => (
                                                                            <li className='productNameDiv' style={{ width: "100%", textAlign: "center" }} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                                                <div>
                                                                                    {editProduct && editProduct.id === product.id ? (
                                                                                        <div>
                                                                                            <input type="text" name="name" value={editProduct.name} onChange={handleProductEditChange} />
                                                                                            <input type="text" name="price" value={editProduct.price} onChange={handleProductEditChange} />
                                                                                            <input type="text" name="description" value={editProduct.description} onChange={handleProductEditChange} />
                                                                                        </div>
                                                                                    ) : (
                                                                                        <div>
                                                                                            <div style={{ display: "flex", justifyContent: "space-between", width: "300px", margin: "auto" }}>
                                                                                                <p>{product.name}</p>
                                                                                                <p>{product.price} ₺</p>
                                                                                            </div>
                                                                                            <p>{product.description}</p>
                                                                                        </div>
                                                                                    )}
                                                                                    {editProduct && editProduct.id === product.id ? (
                                                                                        <button onClick={() => saveProductEdit(category.id)}>Ürünü Kaydet</button>
                                                                                    ) : (
                                                                                        <button onClick={() => startEditProduct(product)}>Ürünü Düzenle</button>
                                                                                    )}
                                                                                    <button style={{ backgroundColor: "red" }} onClick={() => removeProduct(category.id, product.id)}>Ürünü Sil</button>
                                                                                </div>
                                                                            </li>
                                                                        )}
                                                                    </Draggable>
                                                                ))}
                                                                {provided.placeholder}
                                                            </ul>
                                                        )}
                                                    </Droppable>
                                                </div>
                                            </li>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </ul>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>


            <div style={{ padding: "30px" }}>
                <div className="qr-code">
                    <h2>Kafenizin QR Kodu</h2>
                    <QRCodeSVG value={`http://${domain}`}
                        size={128}
                        bgColor="#ffffff"
                        fgColor="#000000"
                        level="L"
                        ref={qrCodeRef} />
                </div>
                <div>
                    <button onClick={() => downloadQRCode('svg')}>QR Kodu SVG Olarak İndir</button>
                    <button onClick={() => downloadQRCode('jpeg')}>QR Kodu JPEG Olarak İndir</button>
                </div>
                <button style={{ backgroundColor: "green" }} onClick={saveMenu} className="save-button">Menüyü Kaydet</button>
                <button onClick={goToMenuPage} style={{ marginTop: '20px', padding: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', cursor: 'pointer' }}>
                    Anasayfaya Dön
                </button>
                <button onClick={handleLogout} style={{ marginTop: '20px', padding: '10px', backgroundColor: '#dc3545', color: '#fff', border: 'none', cursor: 'pointer' }}>
                    Çıkış Yap
                </button>
            </div></div>
    );
};

export default AdminPanel;
