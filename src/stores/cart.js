import { ref, computed, watchEffect } from 'vue'
import { defineStore } from 'pinia'
import { collection, addDoc, runTransaction, doc } from 'firebase/firestore'
import { useFirestore } from 'vuefire'
import { useCouponStore } from './coupon'
import { getCurrentDate } from '../helpers'

export const useCartStore = defineStore('cart', () => {

    const coupon = useCouponStore()
    const db = useFirestore()

    const items = ref([])
    const subtotal = ref(0)
    const taxes = ref(0)
    const total = ref(0)

    const message = ref('')

    const MAX_PRODUCTS = 5
    const TAX_RATE = .10

    // las dependencias son los ref o reactive en este contexto
    // detecta cualquier cambio de los diferentes estados
    watchEffect(() => {
        subtotal.value = items.value.reduce((total, item) => total + (item.quantity * item.price), 0)
        taxes.value = Number((subtotal.value * TAX_RATE).toFixed(2))
        total.value = Number(((subtotal.value + taxes.value) - coupon.discount).toFixed(2))
        // ya no se pone coupon.discount.value porque ya estamos en otro archivo
    })

    function addItem(item) {
        const index = isItemInCart(item.id)
        if (index >= 0) {
            if (isProductAvailable(item, index)) { // más cantidades que lo disponible
                alert('Has alcanzado el límite')
                return
            }
            // actualizar cantidad
            items.value[index].quantity++ 
        } else {
            items.value.push({ ...item, quantity: 1, id: item.id })
        }
    }

    function updateQuantity(id, quantity) {
        items.value = items.value.map(item => item.id === id ? { ...item, quantity } : item)
    }

    function removeItem(id) {
        items.value = items.value.filter(item => item.id !== id)
    }

    async function checkout() {
        try {
            await addDoc(collection(db, 'sales'), {
                items: items.value.map(item => {
                    const { availability, category, ...data } = item
                    return data
                }),
                subtotal: subtotal.value,
                taxes: taxes.value,
                discount: coupon.discount,
                total: total.value,
                date: getCurrentDate()
            })

            // sustraer la cantidad de lo disponible
            items.value.forEach( async (item) => {
                const productRef = doc(db, 'products', item.id)
                await runTransaction(db, async (transaction) => {
                    const currentProduct = await transaction.get(productRef)
                    const availability = currentProduct.data().availability - item.quantity
                    transaction.update(productRef, { availability })
                })
            })

            // Reiniciar el state
            $reset()
            coupon.$reset()

            showMessage()

        } catch (error) {
            console.log(error)
        }
    }

    function $reset() {
        items.value = []
        subtotal.value = 0
        taxes.value = 0
        total.value = 0
    }

    function showMessage() {
        message.value = '¡Venta Exitosa!'
        setTimeout(() => {
            message.value = ''
        }, 4000)
    }

    const isItemInCart = id => items.value.findIndex(item => item.id === id)

    const isProductAvailable = (item, index) => {
        return items.value[index].quantity >= item.availability || items.value[index].quantity >= MAX_PRODUCTS
    }

    const isEmpty = computed(() => items.value.length === 0)

    const checkProductAvailability = computed(() => {
        return (product) => product.availability < 5 ?  product.availability : MAX_PRODUCTS
    })

    const hasMessage = computed(() => message.value)

    return {
        items,
        subtotal,
        taxes,
        total,
        message,
        addItem,
        updateQuantity,
        removeItem,
        checkout,
        isEmpty,
        checkProductAvailability,
        hasMessage
    }
})