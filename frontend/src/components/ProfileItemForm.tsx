import { useState } from 'react';
import { addItem, updateItem } from '../services/items';
import type { Item, ItemCategoryAdd } from '../types/items.types';
import axios from 'axios';
import { IoIosArrowDown } from 'react-icons/io';
import type { ToastState } from '../types/toast.types';

type AddFormProps = {
    setViewForm: (value: boolean) => void;
    setMyItems: React.Dispatch<React.SetStateAction<Item[]>>;
    editingItem: Item | null;
    setEditingItem: React.Dispatch<React.SetStateAction<Item | null>>;
    setParentToast: React.Dispatch<React.SetStateAction<ToastState>>;
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

const ProfileItemForm = ({
    setViewForm,
    setMyItems,
    editingItem,
    setEditingItem,
    setParentToast,
}: AddFormProps) => {
    const [title, setTitle] = useState<string>(editingItem ? editingItem.title : '');
    const [description, setDescription] = useState<string>(
        editingItem ? editingItem.description : '',
    );
    const [price, setPrice] = useState<string>(
        editingItem ? String(editingItem.price_per_day) : '',
    );
    const [category, setCategory] = useState<ItemCategoryAdd>(
        editingItem ? (editingItem.category as ItemCategoryAdd) : 'Оберіть категорію',
    );

    const initialCategoryBy = editingItem
        ? categories.find(c => c.title === editingItem.category)?.category || 'Select category'
        : 'Select category';

    const [categoryBy, setCategoryBy] = useState<CategoryValue>(initialCategoryBy);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setSelectedFiles(Array.from(e.target.files));
        }
    };

    const addNewItem = async () => {
        const newItem = {
            title: title,
            description: description,
            price_per_day: Number(price),
            category: category,
        };

        const createdItem = await addItem(newItem, selectedFiles);
        setMyItems(prevItems => [createdItem, ...prevItems]);
    };

    const editMyItem = async () => {
        if (!editingItem) return;

        const editItemData = {
            title: title,
            description: description,
            price_per_day: Number(price),
            category: category,
        };

        const newEditItem = await updateItem(editingItem.id, editItemData, selectedFiles);
        setMyItems(prevItems =>
            prevItems.map(item => (item.id === editingItem.id ? newEditItem : item)),
        );
    };

    const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
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

        const isEditMode = !!editingItem;

        try {
            if (editingItem) {
                await editMyItem();
            } else {
                await addNewItem();
            }

            setTitle('');
            setDescription('');
            setPrice('');
            setCategory('Оберіть категорію');
            setSelectedFiles([]);
            setEditingItem(null);
            setViewForm(false);

            setParentToast({
                show: true,
                message: isEditMode ? 'Річ успішно змінено!' : 'Річ успішно додано!',
                type: 'success',
            });
        } catch (err) {
            let errorMessage = 'Сталася непередбачувана помилка';
            if (axios.isAxiosError(err)) {
                errorMessage = err.response?.data.message || 'Помилка при обробці запиту';
                setError(errorMessage);
            }

            setParentToast({
                show: true,
                message: errorMessage,
                type: 'error',
            });
        }
    };

    return (
        <div className="profile-item-box">
            <form className="profile-item-form" onSubmit={handleSubmit}>
                <h3 className="profile-item-form__title">Додати нову річ</h3>
                <div className="profile-item-form__group">
                    <label className="profile-item-form__label">Назва речі</label>
                    <input
                        className="profile-item-form__input"
                        type="text"
                        minLength={1}
                        placeholder="Наприклад: PlayStation 5 Slim"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="profile-item-form__group">
                    <label className="profile-item-form__label">Детальний опис</label>
                    <textarea
                        className="profile-item-form__textarea"
                        minLength={10}
                        placeholder="Опишіть стан речі, комплектацію та умови оренди..."
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        required
                    />
                </div>
                <div className="profile-item-form__row">
                    <div className="profile-item-form__group">
                        <label className="profile-item-form__label">Ціна за добу (грн)</label>
                        <input
                            className="profile-item-form__input"
                            type="number"
                            placeholder="0"
                            value={price}
                            onChange={e => setPrice(e.target.value)}
                            required
                        />
                    </div>
                    <div className="profile-item-form__group">
                        <label className="profile-item-form__label">Категорія</label>
                        <div
                            className="profile-item-form__category-container"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            <span>{categories.find(c => c.category === categoryBy)?.title}</span>
                            <IoIosArrowDown
                                className={`profile-item-form__category-icon ${isOpen ? 'profile-item-form__category-icon--open' : ''}`}
                            />
                            {isOpen && (
                                <div
                                    className="profile-item-form__category-options"
                                    onClick={e => e.stopPropagation()}
                                >
                                    {categories.map(c => (
                                        <div
                                            key={c.id}
                                            className={`profile-item-form__category-option ${categoryBy === c.category ? 'profile-item-form__category-option--selected' : ''}`}
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
                <div className="profile-item-form__group">
                    <label className="profile-item-form__label">Посилання на зображення</label>
                    <input
                        className="profile-item-form__input"
                        type="file"
                        multiple
                        accept="image/*"
                        placeholder="https://example.com/image.jpg"
                        onChange={handleFileChange}
                    />
                </div>
                <button className="profile-item-form__submit-btn" type="submit">
                    {editingItem ? '💾 Зберегти зміни' : '🚀 Опублікувати річ'}
                </button>
                {error && <div className="profile-item-form__error-msg">{error}</div>}
            </form>
        </div>
    );
};

export default ProfileItemForm;
