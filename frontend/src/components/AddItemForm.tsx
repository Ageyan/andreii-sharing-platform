import { useState } from 'react';
import { addItem } from '../services/items';
import type { Item } from '../types/items.types';
import axios from 'axios';

type AddFormProps = {
    setViewForm: (value: boolean) => void;
    setMyItems: React.Dispatch<React.SetStateAction<Item[]>>;
};

const AddItemForm = ({ setViewForm, setMyItems }: AddFormProps) => {
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [price, setPrice] = useState<string>('');
    const [category, setCategory] = useState<string>('');
    const [image, setImage] = useState<string>('');
    const [error, setError] = useState<string>('');

    const addNewItem = async (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError('');
        try {
            const newItem = {
                title: title,
                description: description,
                price_per_day: Number(price),
                category: category,
                image_url: [image],
            };

            const createdItem = await addItem(newItem);
            setMyItems(prevItems => [createdItem, ...prevItems]);
            setTitle('');
            setDescription('');
            setPrice('');
            setCategory('');
            setImage('');
            setViewForm(false);
        } catch (err) {
            if (axios.isCancel(err)) {
                return;
            }

            if (axios.isAxiosError(err)) {
                const message = err.response?.data.message || 'Помилка при cтворенні речі';
                setError(message);
            } else {
                setError('Сталася непередбачувана помилка');
                console.error('Невідома помилка:', err);
            }
        }
    };

    return (
        <div className="add-item-box">
            <form className="add-item-form" onSubmit={addNewItem}>
                <h3 className="add-item-form__title">Додати нову річ</h3>
                <div className="add-item-form__group">
                    <label className="add-item-form__label">Назва речі</label>
                    <input
                        className="add-item-form__input"
                        type="text"
                        minLength={1}
                        placeholder="Наприклад: PlayStation 5 Slim"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="add-item-form__group">
                    <label className="add-item-form__label">Детальний опис</label>
                    <textarea
                        className="add-item-form__textarea"
                        minLength={10}
                        placeholder="Опишіть стан речі, комплектацію та умови оренди..."
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        required
                    />
                </div>
                <div className="add-item-form__row">
                    <div className="add-item-form__group">
                        <label className="add-item-form__label">Ціна за добу (грн)</label>
                        <input
                            className="add-item-form__input"
                            type="number"
                            placeholder="0"
                            value={price}
                            onChange={e => setPrice(e.target.value)}
                            required
                        />
                    </div>
                    <div className="add-item-form__group">
                        <label className="add-item-form__label">Категорія</label>
                        <input
                            className="add-item-form__input"
                            type="text"
                            placeholder="Оберіть категорію"
                            value={category}
                            onChange={e => setCategory(e.target.value)}
                            required
                        />
                    </div>
                </div>
                <div className="add-item-form__group">
                    <label className="add-item-form__label">Посилання на зображення</label>
                    <input
                        className="add-item-form__input"
                        type="text"
                        placeholder="https://example.com/image.jpg"
                        value={image}
                        onChange={e => setImage(e.target.value)}
                    />
                </div>
                <button className="add-item-form__submit-btn" type="submit">
                    🚀 Опублікувати річ
                </button>
                {error && <div className="add-item-form__error-msg">{error}</div>}
            </form>
        </div>
    );
};

export default AddItemForm;
