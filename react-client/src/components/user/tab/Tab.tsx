import { useState } from "react";
import { MovieType } from "../../../types/movie";
import WatchList from "../watchlist/WatchList";
import Favorites from "../favorite/Favorites";

const Tab: React.FC<{ favorites: MovieType[], watchlist: MovieType[] }> = ({ favorites, watchlist }) => {
    const [activeTab, setActiveTab] = useState<'favorites' | 'watchlist' | null>('favorites');

    return (
        <div>
            <div className="profile-navigation">
                <div
                    className={`tab ${activeTab === 'favorites' ? 'active' : ''}`}
                    onClick={() => setActiveTab('favorites')}
                >
                    <h2> Favorites</h2>

                </div>
                <div
                    className={`tab ${activeTab === 'watchlist' ? 'active' : ''}`}
                    onClick={() => setActiveTab('watchlist')}
                >
                    <h2> Watchlist</h2>
                </div>
            </div>

            <div className="profile-content">
                {activeTab === 'favorites' && <Favorites movies={favorites} />}
                {activeTab === 'watchlist' && <WatchList movies={watchlist} />}
            </div>
        </div>
    );
}

export default Tab;