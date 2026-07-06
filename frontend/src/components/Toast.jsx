export function Toast ({toast}) {
    if(!toast) return null;
    return (
        <div className = {`toast-cart ${toast.type === "error" ? "toast-cart--error" : ""}`}>
            <p className = "text-body">{toast.message}</p>
        </div>
    );
}