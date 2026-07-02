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

export type ItemCategory = 'Усі речі' | 'Авто' | 'Електроніка' | 
'Робота' | 'Запчастини' | 'Дім і сад' | 'Бізнес та послуги' | 'Дитячий світ' 
| 'Відпочинок і спорт' | 'Товари для геймерів' | 'Нерухомість';