import React from 'react'
import {
  Box,
  Alert,
  Tabs,
  Tab,
  Typography,
  LinearProgress,
} from '@mui/material'
import { useTheme, alpha } from '@mui/material'
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  Check as CheckIcon,
  Delete as DeleteIcon,
  VisibilityOff as InactiveIcon,
  Visibility as ActiveIcon,
  Close as CloseIcon,
} from '@mui/icons-material'
import { Menu, MenuItem, ListItemText } from '@mui/material'
import type { Product, ProductVariant, ProductImage } from '../../types'
import ProductsTable from './ProductsTable'
import ProductsMobileList from './ProductsMobileList'
import VariantsTable from './VariantsTable'
import VariantsCards from './VariantsCards'
import ImagesManagement from './ImagesManagement'
import { Button } from '@mui/material'
import { useThemeMode } from '../../contexts/ThemeModeContext'

interface ProductsTabsProps {
  activeTab: number
  productsData?: { results: Product[]; count: number }
  variantsData?: { results: ProductVariant[]; count: number }
  allProducts?: { results: Product[] }
  allImages?: ProductImage[]
  productImages?: ProductImage[]
  isLoading: boolean
  variantsLoading: boolean
  imagesLoading: boolean
  page: number
  variantPage: number
  productSearch: string
  variantSearch: string
  productInputValue: string
  variantInputValue: string
  error: string
  variantError: string
  isMobile: boolean
  selectedProductForImages: number | null
  onTabChange: (_: React.SyntheticEvent, newValue: number) => void
  onProductInputValueChange: (value: string) => void
  onVariantInputValueChange: (value: string) => void
  onPageChange: (page: number) => void
  onVariantPageChange: (page: number) => void
  onCreateProduct: () => void
  onCreateVariant: () => void
  onEditProduct: (product: Product) => void
  onDeleteProduct: (productId: number) => void
  onUpdateProduct: (product: Product) => void
  onViewProduct: (product: Product) => void
  onEditVariant: (variant: ProductVariant) => void
  onDeleteVariant: (variantId: number) => void
  onViewVariant: (variant: ProductVariant) => void
  onProductForImagesChange: (productId: number | null) => void
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  onImageDelete: (imageId: number) => void
  
  // Sorting & Filtering Props
  productSort: string
  setProductSort: (val: string) => void
  productFilter: string
  setProductFilter: (val: string) => void
  variantSort: string
  setVariantSort: (val: string) => void
  variantFilter: string
  setVariantFilter: (val: string) => void
  
  // Processed Data
  processedProducts: Product[]
  processedVariants: ProductVariant[]
  
  // Selection
  selectedProducts: number[]
  setSelectedProducts: (val: number[]) => void
  selectedVariants: number[]
  setSelectedVariants: (val: number[]) => void
  onBulkDelete: (type: 'products' | 'variants') => void
  onBulkToggleActive: (type: 'products' | 'variants', active: boolean) => void
}

const ProductsTabs: React.FC<ProductsTabsProps> = ({
  activeTab,
  productsData,
  variantsData,
  allProducts,
  allImages,
  productImages,
  isLoading,
  variantsLoading,
  imagesLoading,
  page,
  variantPage,
  productSearch,
  variantSearch,
  productInputValue,
  variantInputValue,
  variantError,
  isMobile,
  selectedProductForImages,
  onTabChange,
  onProductInputValueChange,
  onVariantInputValueChange,
  onPageChange,
  onVariantPageChange,
  onCreateVariant,
  onEditProduct,
  onDeleteProduct,
  onUpdateProduct,
  onViewProduct,
  onEditVariant,
  onDeleteVariant,
  onViewVariant,
  onProductForImagesChange,
  onImageUpload,
  onImageDelete,
  productSort,
  setProductSort,
  productFilter,
  setProductFilter,
  variantSort,
  setVariantSort,
  variantFilter,
  setVariantFilter,
  processedProducts,
  processedVariants,
  selectedProducts,
  setSelectedProducts,
  selectedVariants,
  setSelectedVariants,
  onBulkDelete,
  onBulkToggleActive,
}) => {
  const theme = useTheme()
  const { mode } = useThemeMode()

  // Menu States
  const [filterAnchor, setFilterAnchor] = React.useState<null | HTMLElement>(null)
  const [sortAnchor, setSortAnchor] = React.useState<null | HTMLElement>(null)

  const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => setFilterAnchor(event.currentTarget)
  const handleSortClick = (event: React.MouseEvent<HTMLButtonElement>) => setSortAnchor(event.currentTarget)
  const handleMenuClose = () => {
    setFilterAnchor(null)
    setSortAnchor(null)
  }

  const selectionCount = activeTab === 0 ? selectedProducts.length : selectedVariants.length
  const isSelectionActive = selectionCount > 0


  return (
    <>
      <Box sx={{
        bgcolor: 'background.paper',
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: mode === 'light' ? '0 1px 3px rgba(0,0,0,0.06)' : '0 1px 3px rgba(0,0,0,0.3)',
        overflow: 'hidden',
        mt: 2,
      }}>
        {/* LOADING INDICATOR */}
        {(isLoading || variantsLoading || imagesLoading) && (
          <LinearProgress
            sx={{
              height: 2,
              bgcolor: 'transparent',
              '& .MuiLinearProgress-bar': { bgcolor: 'text.primary' }
            }}
          />
        )}

        {/* TABS INTEGRATED */}
        <Box sx={{ borderBottom: `1px solid ${theme.palette.divider}`, px: 0.5, bgcolor: 'background.paper' }}>
          <Tabs
            value={activeTab}
            onChange={onTabChange}
            sx={{
              minHeight: 44,
              '& .MuiTabs-indicator': {
                backgroundColor: 'text.primary',
                height: 2,
              },
              '& .MuiTab-root': {
                minHeight: 44,
                textTransform: 'none',
                fontSize: '12px',
                fontWeight: 500,
                color: 'text.disabled',
                px: 2,
                minWidth: 'auto',
                transition: 'all 0.1s ease',
                '&.Mui-selected': {
                  color: 'text.primary',
                },
                '&:hover': {
                  color: 'text.secondary',
                }
              },
            }}
          >
            <Tab label="Productos" />
            <Tab label="Variantes" />
            <Tab label="Imágenes" />
          </Tabs>
        </Box>

        {/* TOOLBAR INTEGRATED */}
        {(activeTab === 0 || activeTab === 1) && (
          <Box sx={{
            p: 1.5,
            display: 'flex',
            gap: 1.2,
            alignItems: 'center',
            borderBottom: `1px solid ${theme.palette.divider}`,
            bgcolor: mode === 'light' ? alpha('#fff', 0.5) : alpha('#000', 0.1)
          }}>
            <Box sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              bgcolor: mode === 'light' ? '#f9f9f9' : '#111',
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 1.5,
              px: 1.2,
              py: 0.6,
              transition: 'all 0.2s',
              '&:focus-within': { borderColor: 'text.disabled' }
            }}>
              <SearchIcon sx={{ color: 'text.disabled', fontSize: 16 }} />
              <input
                type="text"
                placeholder={activeTab === 0 ? "Buscar por nombre, marca o tipo..." : "Buscar por SKU, producto o género..."}
                value={activeTab === 0 ? productInputValue : variantInputValue}
                onChange={(e) => activeTab === 0 ? onProductInputValueChange(e.target.value) : onVariantInputValueChange(e.target.value)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  fontSize: '12px',
                  color: theme.palette.text.primary,
                  width: '100%',
                  fontFamily: 'inherit'
                }}
              />
            </Box>

            <Button
              variant="text"
              size="small"
              onClick={handleFilterClick}
              startIcon={<FilterIcon sx={{ fontSize: 14 }} />}
              sx={{
                height: 32,
                borderRadius: 1.5,
                textTransform: 'none',
                fontSize: '12px',
                color: productFilter !== 'all' || variantFilter !== 'all' ? 'text.primary' : 'text.secondary',
                fontWeight: productFilter !== 'all' || variantFilter !== 'all' ? 600 : 400,
                '&:hover': { color: 'text.primary' }
              }}
            >
              Filtros
            </Button>

            <Button
              variant="text"
              size="small"
              onClick={handleSortClick}
              startIcon={<SortIcon sx={{ fontSize: 14 }} />}
              sx={{
                height: 32,
                borderRadius: 1.5,
                textTransform: 'none',
                fontSize: '12px',
                color: productSort !== 'newest' || variantSort !== 'newest' ? 'text.primary' : 'text.secondary',
                fontWeight: productSort !== 'newest' || variantSort !== 'newest' ? 600 : 400,
                '&:hover': { color: 'text.primary' }
              }}
            >
              Ordenar
            </Button>

            {/* Menús de Filtros y Ordenamiento */}
            <Menu
              anchorEl={filterAnchor}
              open={Boolean(filterAnchor)}
              onClose={handleMenuClose}
              PaperProps={{
                sx: { 
                  mt: 1, borderRadius: 1.5, minWidth: 160,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }
              }}
            >
              {activeTab === 0 ? (
                // Filtros de Productos
                [
                  { label: 'Todos', value: 'all' },
                  { label: 'Solo Activos', value: 'active' },
                  { label: 'Solo Inactivos', value: 'inactive' }
                ].map((opt) => (
                  <MenuItem 
                    key={opt.value} 
                    onClick={() => { setProductFilter(opt.value); handleMenuClose(); }}
                    sx={{ fontSize: '11px', py: 0.8 }}
                  >
                    <ListItemText primary={opt.label} primaryTypographyProps={{ fontSize: '11px' }} />
                    {productFilter === opt.value && <CheckIcon sx={{ fontSize: 14, ml: 1 }} />}
                  </MenuItem>
                ))
              ) : (
                // Filtros de Variantes
                [
                  { label: 'Todos', value: 'all' },
                  { label: 'Hombre', value: 'men' },
                  { label: 'Mujer', value: 'women' },
                  { label: 'Activos', value: 'active' }
                ].map((opt) => (
                  <MenuItem 
                    key={opt.value} 
                    onClick={() => { setVariantFilter(opt.value); handleMenuClose(); }}
                    sx={{ fontSize: '11px', py: 0.8 }}
                  >
                    <ListItemText primary={opt.label} primaryTypographyProps={{ fontSize: '11px' }} />
                    {variantFilter === opt.value && <CheckIcon sx={{ fontSize: 14, ml: 1 }} />}
                  </MenuItem>
                ))
              )}
            </Menu>

            <Menu
              anchorEl={sortAnchor}
              open={Boolean(sortAnchor)}
              onClose={handleMenuClose}
              PaperProps={{
                sx: { 
                  mt: 1, borderRadius: 1.5, minWidth: 160,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }
              }}
            >
              {activeTab === 0 ? (
                // Ordenamiento de Productos
                [
                  { label: 'Más recientes', value: 'newest' },
                  { label: 'Nombre (A-Z)', value: 'name-asc' },
                  { label: 'Nombre (Z-A)', value: 'name-desc' },
                  { label: 'Stock (Menor a Mayor)', value: 'stock-asc' },
                  { label: 'Stock (Mayor a Menor)', value: 'stock-desc' }
                ].map((opt) => (
                  <MenuItem 
                    key={opt.value} 
                    onClick={() => { setProductSort(opt.value); handleMenuClose(); }}
                    sx={{ fontSize: '11px', py: 0.8 }}
                  >
                    <ListItemText primary={opt.label} primaryTypographyProps={{ fontSize: '11px' }} />
                    {productSort === opt.value && <CheckIcon sx={{ fontSize: 14, ml: 1 }} />}
                  </MenuItem>
                ))
              ) : (
                // Ordenamiento de Variantes
                [
                  { label: 'Más recientes', value: 'newest' },
                  { label: 'SKU (A-Z)', value: 'sku-asc' },
                  { label: 'Precio (Menor a Mayor)', value: 'price-asc' },
                  { label: 'Precio (Mayor a Menor)', value: 'price-desc' },
                  { label: 'Stock (Menor a Mayor)', value: 'stock-asc' }
                ].map((opt) => (
                  <MenuItem 
                    key={opt.value} 
                    onClick={() => { setVariantSort(opt.value); handleMenuClose(); }}
                    sx={{ fontSize: '11px', py: 0.8 }}
                  >
                    <ListItemText primary={opt.label} primaryTypographyProps={{ fontSize: '11px' }} />
                    {variantSort === opt.value && <CheckIcon sx={{ fontSize: 14, ml: 1 }} />}
                  </MenuItem>
                ))
              )}
            </Menu>

            {activeTab === 1 && (
              <Button
                variant="contained"
                size="small"
                onClick={onCreateVariant}
                sx={{
                  height: 32,
                  borderRadius: 1.5,
                  textTransform: 'none',
                  fontSize: '12px',
                  bgcolor: 'text.primary',
                  color: 'background.default',
                  ml: 1,
                  '&:hover': { bgcolor: 'text.secondary' }
                }}
              >
                + Nueva variante
              </Button>
            )}
          </Box>
        )}

        {/* CONTENT AREA */}
        <Box sx={{ p: 0 }}>
          {activeTab === 0 && (
            isMobile ? (
              <Box p={2}>
                <ProductsMobileList
                  products={processedProducts}
                  loading={isLoading}
                  page={page}
                  totalCount={productsData?.count || 0}
                  onPageChange={onPageChange}
                  onEdit={onEditProduct}
                  onDelete={onDeleteProduct}
                  search={productSearch}
                  onView={onViewProduct}
                />
              </Box>
            ) : (
              <ProductsTable
                products={processedProducts}
                loading={isLoading}
                page={page}
                totalCount={productsData?.count || 0}
                onPageChange={onPageChange}
                onEdit={onEditProduct}
                onDelete={onDeleteProduct}
                search={productSearch}
                onUpdate={onUpdateProduct}
                onView={onViewProduct}
                selectedIds={selectedProducts}
                onSelectionChange={setSelectedProducts}
                currentSort={productSort}
                onSortChange={setProductSort}
              />
            )
          )}

          {activeTab === 1 && (
            <>
              {variantError && <Alert severity="error" sx={{ m: 2 }}>{variantError}</Alert>}
              {isMobile ? (
                <Box p={2}>
                  <VariantsCards
                    variants={processedVariants}
                    loading={variantsLoading}
                    page={variantPage}
                    totalCount={variantsData?.count || 0}
                    allProducts={allProducts?.results || []}
                    onPageChange={onVariantPageChange}
                    onEdit={onEditVariant}
                    onDelete={onDeleteVariant}
                    images={allImages || []}
                    search={variantSearch}
                    onView={onViewVariant}
                  />
                </Box>
              ) : (
                <VariantsTable
                  variants={processedVariants}
                  loading={variantsLoading}
                  page={variantPage}
                  totalCount={variantsData?.count || 0}
                  allProducts={allProducts?.results || []}
                  onPageChange={onVariantPageChange}
                  onEdit={onEditVariant}
                  onDelete={onDeleteVariant}
                  images={allImages || []}
                  search={variantSearch}
                  onView={onViewVariant}
                  selectedIds={selectedVariants}
                  onSelectionChange={setSelectedVariants}
                  currentSort={variantSort}
                  onSortChange={setVariantSort}
                />
              )}
            </>
          )}

          {activeTab === 2 && (
            <Box p={2}>
              <ImagesManagement
                allProducts={allProducts?.results || []}
                selectedProduct={selectedProductForImages}
                onProductChange={onProductForImagesChange}
                onUpload={onImageUpload}
                onDelete={onImageDelete}
                images={productImages || []}
                loading={imagesLoading}
                uploadLoading={false}
                variants={variantsData?.results || []}
              />
            </Box>
          )}
        </Box>
      </Box>

      {/* FLOATING BULK ACTION BAR */}
      {isSelectionActive && (activeTab === 0 || activeTab === 1) && (
        <Box sx={{
          position: 'fixed',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          bgcolor: 'text.primary',
          color: 'background.paper',
          px: 2,
          py: 1.2,
          borderRadius: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          zIndex: 1000,
          animation: 'slideUp 0.3s ease-out',
          '@keyframes slideUp': {
            from: { transform: 'translateX(-50%) translateY(100%)', opacity: 0 },
            to: { transform: 'translateX(-50%) translateY(0)', opacity: 1 }
          }
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pr: 2, borderRight: '1px solid rgba(255,255,255,0.2)' }}>
            <Box sx={{ 
              width: 20, height: 20, borderRadius: '50%', 
              bgcolor: 'background.paper', color: 'text.primary',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '10px', fontWeight: 700
            }}>
              {selectionCount}
            </Box>
            <Typography sx={{ fontSize: '12px', fontWeight: 500 }}>
              {selectionCount === 1 ? 'Seleccionado' : 'Seleccionados'}
            </Typography>
          </Box>

          <Button
            size="small"
            startIcon={<ActiveIcon sx={{ fontSize: 16 }} />}
            onClick={() => onBulkToggleActive(activeTab === 0 ? 'products' : 'variants', true)}
            sx={{ 
              color: 'inherit', textTransform: 'none', fontSize: '12px',
              '&:hover': { bgcolor: alpha('#fff', 0.1) }
            }}
          >
            Activar
          </Button>

          <Button
            size="small"
            startIcon={<InactiveIcon sx={{ fontSize: 16 }} />}
            onClick={() => onBulkToggleActive(activeTab === 0 ? 'products' : 'variants', false)}
            sx={{ 
              color: 'inherit', textTransform: 'none', fontSize: '12px',
              '&:hover': { bgcolor: alpha('#fff', 0.1) }
            }}
          >
            Desactivar
          </Button>

          <Button
            size="small"
            startIcon={<DeleteIcon sx={{ fontSize: 16 }} />}
            onClick={() => onBulkDelete(activeTab === 0 ? 'products' : 'variants')}
            sx={{ 
              color: '#ff4d4d', textTransform: 'none', fontSize: '12px',
              '&:hover': { bgcolor: alpha('#ff4d4d', 0.1) }
            }}
          >
            Eliminar
          </Button>

          <Box
            onClick={() => activeTab === 0 ? setSelectedProducts([]) : setSelectedVariants([])}
            sx={{ 
              ml: 1, p: 0.5, borderRadius: '50%', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              '&:hover': { bgcolor: alpha('#fff', 0.1) }
            }}
          >
            <CloseIcon sx={{ fontSize: 16 }} />
          </Box>
        </Box>
      )}
    </>
  )
}

export default ProductsTabs
