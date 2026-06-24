import { useState, useEffect } from 'react';
import axios from 'axios';
import type { Item } from '../types/items.types';
import { getItems } from '../services/items';

const HomePage = () => {
    const [items, setItems] = useState<Item[]>([]);
    const [loader, setLoader] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const timeot = setTimeout(() => {
            const getItemsList = async () => {
                setLoader(true);
                try {
                    const res = await getItems();
                    setItems(res);
                } catch (err) {
                    if (axios.isAxiosError(err)) {
                        const message =
                            err.response?.data.message ||
                            'Помилка при отриманні списку речей';
                        setError(message);
                    } else {
                        setError('Сталася непередбачувана помилка');
                        console.error('Невідома помилка:', err);
                    }
                } finally {
                    setLoader(false);
                }
            };
            getItemsList();
        }, 800);

        return () => clearTimeout(timeot);
    }, []);

    return (
        <div className="home-page__container">
            {loader && <div>Завантаження товарів...</div>}
            {error && <div style={{ color: 'red' }}>{error}</div>}

            {!loader &&
                !error &&
                items.map(item => (
                    <div
                        key={item.id}
                        style={{
                            background: '#fff',
                            padding: '20px',
                            borderRadius: '8px',
                        }}
                    >
                        <h3>{item.title}</h3>
                        <p>{item.description}</p>
                        <p>{item.category}</p>
                        <p>{item.price_per_day} грн/день</p>
                    </div>
                ))}
        </div>
    );
};

export default HomePage;
