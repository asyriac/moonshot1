import { Button } from "./ui/button";

type EmailFilterProps = {
  filter: string;
  setFilter: (filterName: string) => void;
};

const EmailFilters = ({filter, setFilter}: EmailFilterProps) => {
    return (
        <div className="flex items-center gap-2 mb-6">
        <div className="">Filter By:</div>
        <Button variant={filter === 'All' ? 'secondary' : 'ghost'} onClick={() => setFilter('All')}>All</Button>
      <Button variant={filter === 'Unread' ? 'secondary' : 'ghost'} onClick={() => setFilter('Unread')}>Unread</Button>
      <Button variant={filter === 'Read' ? 'secondary' : 'ghost'} onClick={() => setFilter('Read')}>Read</Button>
      <Button variant={filter === 'Favorites' ? 'secondary' : 'ghost'} onClick={() => setFilter('Favorites')}>Favorites</Button>
      </div>
    )
}

export default EmailFilters;