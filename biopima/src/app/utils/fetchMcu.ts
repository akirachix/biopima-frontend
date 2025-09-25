const baseUrl = '/api/mcus';

export  async function fetchMcu() {
    try {
        const response= await fetch(`${baseUrl}`);
        if (!response.ok) {
            throw new Error("Something went wrong" + response.statusText);
    }
    const result= await response.json();
        return result;
}catch (error) {
        throw new Error('Failed to fetch mcu' + (error as Error).message)
    }}