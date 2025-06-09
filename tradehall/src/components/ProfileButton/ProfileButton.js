import { CircleUserRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './ProfileButton.css';

export default function ProfileButton() {
    const navigate = useNavigate();

    return (
        <CircleUserRound className='profileicon' onClick={() => navigate("/profile")} />
    );
}