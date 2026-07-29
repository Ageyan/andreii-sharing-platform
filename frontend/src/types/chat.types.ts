export type CreateChatResponse = {
    id: number;
    item_id: number;
    owner_id: number;
    renter_id: number;
}

export interface GetUserChatsProps {
    chat_id: number;
    item_id: number;
    renter_id: number;
    owner_id: number;
    created_at: string;
    item_title: string;
    item_image: string;
}