import React, { useState } from 'react';
import { Screen, CustomizationState, QuoteItem, OrderRecord, FurnitureModel } from './types';
import { INITIAL_CUSTOMIZATION, INITIAL_ORDERS, CATALOG_MODELS } from './data/mockData';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { CatalogView } from './views/CatalogView';
import { PersonalizerView } from './views/PersonalizerView';
import { AIAssistantView } from './views/AIAssistantView';
import { CheckoutView } from './views/CheckoutView';
import { OrdersView } from './views/OrdersView';
import { SavedQuotesView } from './views/SavedQuotesView';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('catalogo');
  const [customization, setCustomization] = useState<CustomizationState>(INITIAL_CUSTOMIZATION);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Cart with initial active quote item (matches the $1,240.00 / Chilean peso dynamic amount)
  const [cartItems, setCartItems] = useState<QuoteItem[]>([
    {
      id: 'quote-init-1',
      model: CATALOG_MODELS[0],
      alto: 180,
      ancho: 160,
      prof: 40,
      shelves: 4,
      wood: INITIAL_CUSTOMIZATION.wood,
      finish: 'Poro Mate Satinado Ecológico',
      hardware: 'Blum Cierre Suave Negro Mate',
      includeInstallation: true,
      baseCost: 330048,
      materialsCost: 195000,
      laborCost: 98000,
      finishCost: 32000,
      discount: 14500,
      installationCost: 28000,
      totalCost: 362796,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'quote-init-2',
      model: CATALOG_MODELS[1],
      alto: 50,
      ancho: 180,
      prof: 42,
      shelves: 2,
      wood: INITIAL_CUSTOMIZATION.wood,
      finish: 'Poro Mate Satinado Ecológico',
      hardware: 'Push-to-open',
      includeInstallation: false,
      baseCost: 285000,
      materialsCost: 160000,
      laborCost: 85000,
      finishCost: 28000,
      discount: 11000,
      installationCost: 0,
      totalCost: 285000,
      createdAt: new Date().toISOString(),
    },
  ]);

  const [orders, setOrders] = useState<OrderRecord[]>(INITIAL_ORDERS as unknown as OrderRecord[]);

  const cartTotal = cartItems.reduce((acc, item) => acc + item.totalCost, 0);

  const handleSelectModelFromCatalog = (model: FurnitureModel) => {
    setCustomization({
      ...customization,
      model,
      alto: model.baseAlto,
      ancho: model.baseAncho,
      prof: model.baseProf,
      shelves: model.defaultShelves,
    });
    setCurrentScreen('personalizador-3d');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleApplyDimensionsFromAI = (partial: Partial<CustomizationState>) => {
    setCustomization((prev) => ({
      ...prev,
      ...partial,
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = (item: QuoteItem) => {
    setCartItems((prev) => {
      // replace or add
      const existing = prev.findIndex((i) => i.model.id === item.model.id);
      if (existing >= 0) {
        const copy = [...prev];
        copy[existing] = item;
        return copy;
      }
      return [item, ...prev];
    });
  };

  const handleRemoveFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleOrderCreated = (order: OrderRecord) => {
    setOrders((prev) => [order, ...prev]);
  };

  const handleNavigate = (screen: Screen) => {
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#fbf9f3] text-[#1b1c18] font-body selection:bg-[#003745] selection:text-white">
      {/* Universal Header */}
      <Header
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
        cartCount={cartItems.length}
        cartTotal={cartTotal}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Main Content Area */}
      <main className="w-full pt-20 flex-1">
        {currentScreen === 'catalogo' && (
          <CatalogView
            onSelectModel={handleSelectModelFromCatalog}
            onNavigate={handleNavigate}
          />
        )}

        {currentScreen === 'personalizador-3d' && (
          <PersonalizerView
            customization={customization}
            onChangeCustomization={setCustomization}
            onNavigate={handleNavigate}
            onAddToCart={handleAddToCart}
          />
        )}

        {currentScreen === 'asistente-ia' && (
          <AIAssistantView
            onNavigate={handleNavigate}
            onApplyDimensions={handleApplyDimensionsFromAI}
          />
        )}

        {currentScreen === 'checkout' && (
          <CheckoutView
            currentQuote={cartItems[0] || {
              id: 'quote-fallback',
              model: customization.model,
              alto: customization.alto,
              ancho: customization.ancho,
              prof: customization.prof,
              shelves: customization.shelves,
              wood: customization.wood,
              finish: customization.finish,
              hardware: customization.hardware,
              includeInstallation: customization.includeInstallation,
              baseCost: customization.model.basePrice,
              materialsCost: 195000,
              laborCost: 98000,
              finishCost: 32000,
              discount: 13752,
              installationCost: 28000,
              totalCost: 362796,
              createdAt: new Date().toISOString(),
            }}
            onNavigate={handleNavigate}
            onOrderCreated={handleOrderCreated}
          />
        )}

        {currentScreen === 'mis-pedidos' && (
          <OrdersView orders={orders} onNavigate={handleNavigate} />
        )}

        {currentScreen === 'cotizaciones-guardadas' && (
          <SavedQuotesView
            onNavigate={handleNavigate}
            onLoadCustomization={(c) => {
              setCustomization(c);
              handleNavigate('personalizador-3d');
            }}
          />
        )}
      </main>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onRemoveItem={handleRemoveFromCart}
        onNavigate={handleNavigate}
      />

      {/* Universal Footer */}
      <Footer />
    </div>
  );
}
