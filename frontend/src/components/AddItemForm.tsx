import { useState } from 'react';
import { addItem } from '../services/items';
import type { Item, ItemCategoryAdd } from '../types/items.types';
import axios from 'axios';
import { IoIosArrowDown } from 'react-icons/io';

type AddFormProps = {
    setViewForm: (value: boolean) => void;
    setMyItems: React.Dispatch<React.SetStateAction<Item[]>>;
};

type CategoryValue =
    | 'Select category'
    | 'Auto'
    | 'Electronics'
    | 'Work'
    | 'Spare parts'
    | 'Home and garden'
    | 'Business and services'
    | 'Children world'
    | 'Leisure and sports'
    | 'Gamer goods'
    | 'Real estate';

type CategoryList = {
    id: number;
    title: ItemCategoryAdd;
    category: CategoryValue;
};

const categories: CategoryList[] = [
    { id: 1, title: 'Оберіть категорію', category: 'Select category' },
    { id: 2, title: 'Авто', category: 'Auto' },
    { id: 3, title: 'Електроніка', category: 'Electronics' },
    { id: 4, title: 'Робота', category: 'Work' },
    { id: 5, title: 'Запчастини', category: 'Spare parts' },
    { id: 6, title: 'Дім і сад', category: 'Home and garden' },
    { id: 7, title: 'Бізнес та послуги', category: 'Business and services' },
    { id: 8, title: 'Дитячий світ', category: 'Children world' },
    { id: 9, title: 'Відпочинок і спорт', category: 'Leisure and sports' },
    { id: 10, title: 'Товари для геймерів', category: 'Gamer goods' },
    { id: 11, title: 'Нерухомість', category: 'Real estate' },
];

const AddItemForm = ({ setViewForm, setMyItems }: AddFormProps) => {
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [price, setPrice] = useState<string>('');
    const [category, setCategory] = useState<ItemCategoryAdd>('Оберіть категорію');
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [categoryBy, setCategoryBy] = useState<CategoryValue>('Select category');
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setSelectedFiles(Array.from(e.target.files));
        }
    };

    const addNewItem = async (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError('');

        if (category === 'Оберіть категорію') {
            setError('Будь ласка, оберіть дійсну категорію для вашої речі');
            return;
        }

        if (price === '0') {
            setError('Будь ласка, оберіть вартість для вашої речі');
            return;
        }

        try {
            const newItem = {
                title: title,
                description: description,
                price_per_day: Number(price),
                category: category,
            };

            const createdItem = await addItem(newItem, selectedFiles);
            setMyItems(prevItems => [createdItem, ...prevItems]);
            setTitle('');
            setDescription('');
            setPrice('');
            setCategory('Оберіть категорію');
            setSelectedFiles([]);
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
                        <div
                            className="add-item-form__category-container"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            <span>{categories.find(c => c.category === categoryBy)?.title}</span>
                            <IoIosArrowDown
                                className={`add-item-form__category-icon ${isOpen ? 'add-item-form__category-icon--open' : ''}`}
                            />
                            {isOpen && (
                                <div
                                    className="add-item-form__category-options"
                                    onClick={e => e.stopPropagation()}
                                >
                                    {categories.map(c => (
                                        <div
                                            key={c.id}
                                            className={`add-item-form__category-option ${categoryBy === c.category ? 'add-item-form__category-option--selected' : ''}`}
                                            onClick={() => {
                                                setCategoryBy(c.category);
                                                setCategory(c.title);
                                                setIsOpen(false);
                                            }}
                                        >
                                            {c.title}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="add-item-form__group">
                    <label className="add-item-form__label">Посилання на зображення</label>
                    <input
                        className="add-item-form__input"
                        type="file"
                        multiple
                        accept="image/*"
                        placeholder="https://example.com/image.jpg"
                        onChange={handleFileChange}
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
