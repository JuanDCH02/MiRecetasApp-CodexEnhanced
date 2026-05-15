import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout';
import { Home } from './pages/Home';
import { RecipeDetailView } from './pages/RecipeDetailView';
import { AuthLayout } from './layouts/AuthLayout';
import RegisterView from './pages/auth/RegisterView';
import LoginView from './pages/auth/LoginView';
import { UserRecipes } from './pages/profileViews/UserRecipes';
import { UserFavorites } from './pages/profileViews/UserFavorites';
import AddRecipeForm from './components/recipes/AddRecipeForm';
import AddCommentModal from './components/comments/AddCommentModal';
import EditRecipeFormModal from './components/recipes/EditRecipeFormModal';
import ConfirmDelete from './components/cards/ConfirmDelete';
import { RequireAuth } from './components/auth/RequireAuth';
import { RequireGuest } from './components/auth/RequireGuest';

export const router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<AppLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/recipes/:recipeId" element={<RecipeDetailView />} />

                    <Route element={<RequireAuth />}>
                        <Route path="/recipes/my-recipes" element={<UserRecipes />} />
                        <Route path="/recipes/favorites" element={<UserFavorites />} />
                        <Route path="/create-recipe" element={<AddRecipeForm />} />
                        <Route path="/recipes/:recipeId/edit" element={<EditRecipeFormModal />} />
                        <Route path="/recipes/:recipeId/confirm-delete" element={<ConfirmDelete />} />
                        <Route path="/recipes/:recipeId/add-comment" element={<AddCommentModal />} />
                    </Route>
                </Route>

                <Route element={<RequireGuest />}>
                    <Route element={<AuthLayout />}>
                        <Route path="/auth/login" element={<LoginView />} />
                        <Route path="/auth/create-account" element={<RegisterView />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
};
