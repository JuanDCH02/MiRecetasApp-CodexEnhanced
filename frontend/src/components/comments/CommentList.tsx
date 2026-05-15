import type { Comment } from '../../types';
import { formatDate } from '../../utils';

type CommentListProps = {
    comments: Comment[];
};

export const CommentList = ({ comments }: CommentListProps) => {
    return (
        <section className="glass-panel rounded-2xl p-5 sm:p-6 mb-10">
            <h2 className="text-2xl font-black mb-4 text-teal-900">Comentarios</h2>
            <div className="space-y-3">
                {comments.length === 0 ? <p className="text-teal-700 italic">Aún no hay comentarios.</p> : null}

                {comments.map((comment) => (
                    <article key={comment._id} className="p-4 rounded-xl border border-teal-100 bg-white/80">
                        <p className="text-teal-600 font-semibold text-xs uppercase tracking-wide">{formatDate(comment.createdAt)}</p>
                        <p className="text-teal-900 font-black capitalize mt-1">{comment.author_name}</p>
                        <p className="text-base text-teal-900/90 mt-2">{comment.content}</p>
                    </article>
                ))}
            </div>
        </section>
    );
};
