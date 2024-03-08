export default function AssistantPage() {
    function chat() {
        console.log('chat');
    }

    return (
        <>
            <div>Assistent</div>
            <button onClick={chat}>Chat</button>
        </>
    );
}
