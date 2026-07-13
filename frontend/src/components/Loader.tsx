type LoaderProps = {
    fullPage?: boolean;
};

const Loader = ({ fullPage = false }: LoaderProps) => {
    return (
        <div className={`loader-container ${fullPage ? 'loader-container--full' : ''}`}>
            <div className="loader-spinner"></div>
        </div>
    );
};

export default Loader;
