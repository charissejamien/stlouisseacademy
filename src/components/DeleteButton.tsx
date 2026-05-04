"use client";
import { Trash } from 'lucide-react';
import { deleteFee } from '@/app/admin/fees/actions';
import toast from 'react-hot-toast';

export function DeleteButton({ id }: { id: string }) {
    
    const handleDelete = async () => {
            try {
                await deleteFee(id);
                toast.success("Fee deleted!");
            } catch (error) {
                toast.error("Failed to delete fee.");
            }
        }

    return (
        <button onClick={handleDelete} className="hover:text-red-500 transition">
            <Trash size={16} />
        </button>
    );
};