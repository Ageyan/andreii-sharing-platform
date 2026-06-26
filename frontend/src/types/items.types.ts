export interface Item {
    id: number
    title: string
    description: string
    price_per_day: number
    category: string
    image_url: string
}

export type ItemCategory = 'Усі речі' | 'Авто' | 'Електроніка' | 
'Работа' | 'Запчастини' | 'Дім і сад' | 'Бізнес та послуги' | 'Дитячий світ' 
| 'Відпочинок і спорт' | 'Товари для геймерів' | 'Нерухомість';