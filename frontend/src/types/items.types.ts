export interface Item {
    id: number
    title: string
    description: string
    price_per_day: number
    category: string
    image_url: string[]
    owner_name: string 
    owner_created_at: string
}

export type CreateItem = Omit<Item, 'id' | 'owner_name' | 'owner_created_at' | 'image_url'>;

export type ItemCategory = 'Усі речі' | 'Авто' | 'Електроніка' | 
'Робота' | 'Запчастини' | 'Дім і сад' | 'Бізнес та послуги' | 'Дитячий світ' 
| 'Відпочинок і спорт' | 'Товари для геймерів' | 'Нерухомість';