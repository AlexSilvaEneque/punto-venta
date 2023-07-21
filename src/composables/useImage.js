import { ref, computed } from 'vue'
import { useFirebaseStorage } from 'vuefire'
import { getDownloadURL, ref as storageRef, uploadBytesResumable } from 'firebase/storage'
import { uid } from 'uid'

export default function useImage() {

    const storage = useFirebaseStorage()

    const url = ref('')

    const onFileChange = e => {
        const file = e.target.files[0]
        const filename = uid() + '.jpg'
        const sRef = storageRef(storage, '/products/' + filename)

        // Sube archivo
        const uploadTask = uploadBytesResumable(sRef, file)

        uploadTask.on('state_changed',
            () => {},
            (error) => console.log(error),
            () => {
                getDownloadURL(uploadTask.snapshot.ref)
                    .then((downloadURL) => {
                        url.value = downloadURL
                    })
            }
        )
    }

    const isImageUploaded = computed(() => {
        return url.value ? url.value : ''
    })

    return {
        url,
        onFileChange,
        isImageUploaded
    }
}