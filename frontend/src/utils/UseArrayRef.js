export default function useArrayRef() {
    const refs = []
    return [refs, el => el && refs.push(el)]
}