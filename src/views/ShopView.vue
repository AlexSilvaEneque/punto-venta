<script setup>
    import { storeToRefs } from 'pinia'
    import MainNav from '../components/MainNav.vue'
    import ProductCard from '../components/ProductCard.vue'
    import ShoppingCart from '../components/ShoppingCart.vue'
    import Alert from '../components/Alert.vue'
    import { useProductsStore } from '../stores/products'
    import { useCartStore } from '../stores/cart'

    const cart = useCartStore()
    const products = useProductsStore()
    const { filteredProducts, noResults } = storeToRefs(products)
</script>

<template>
    <MainNav />

    <main class="p-10 lg:flex lg:h-screen lg:overflow-y-hidden">
        <div class="lg:w-2/3 lg:h-screen lg:overflow-y-scroll py-24 px-10">
            <p v-if="noResults"
                class="text-center text-4xl"
            >
                No hay Productos
            </p>
            <div v-else
                class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5"
            >
                <ProductCard
                    v-for="product in filteredProducts"
                    :key="product.id"
                    :product="product"
                />
            </div>
        </div>

        <aside class="lg:w-1/3 lg:h-screen lg:overflow-y-scroll py-24 px-10">
            <ShoppingCart />
        </aside>

        <Alert v-if="cart.hasMessage">
            {{ cart.message }}
        </Alert>
    </main>
</template>