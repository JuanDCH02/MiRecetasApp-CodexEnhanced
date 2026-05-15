import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { createComment } from '../../services/CommentApi';
import { toast } from 'sonner';
import type { Recipe } from '../../types';
import { useNavigate, useParams } from 'react-router-dom';

export default function AddCommentModal() {
    const { recipeId } = useParams();
    const navigate = useNavigate();
    const [comment, setComment] = useState('');
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: ({ id, content }: { id: Recipe['_id']; content: string }) => createComment(id, content),
        onError(error) {
            toast.error(error.message);
        },
        onSuccess(data) {
            toast.success(data);
            setComment('');
            queryClient.invalidateQueries({ queryKey: ['recipeData', recipeId] });
            navigate(`/recipes/${recipeId}`);
        }
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!comment.trim()) {
            toast.error('El comentario no puede estar vacío');
            return;
        }

        mutate({ id: recipeId!, content: comment });
    };

    return (
        <div className="fixed inset-0 bg-black/25 backdrop-blur-sm flex items-center justify-center z-50 px-4">
            <div className="glass-panel rounded-2xl shadow-xl p-6 w-full max-w-xl">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-black text-teal-900">Agregar comentario</h2>
                    <button type="button" className="text-red-600 text-xl font-bold cursor-pointer" onClick={() => navigate(-1)}>
                        X
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="mt-4">
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="border border-teal-200 p-3 rounded-xl w-full mb-4 min-h-28 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                        placeholder="Escribe tu comentario aquí..."
                    />
                    <button
                        disabled={isPending}
                        className="bg-orange-500 text-white px-5 py-2 rounded-full hover:bg-orange-600 disabled:opacity-70 cursor-pointer"
                    >
                        {isPending ? 'Enviando...' : 'Enviar comentario'}
                    </button>
                </form>
            </div>
        </div>
    );
}
