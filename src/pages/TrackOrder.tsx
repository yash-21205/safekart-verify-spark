import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Search, Package, Truck, MapPin, CheckCircle } from "lucide-react";
import heroTracking from "@/assets/hero-tracking.jpg";

interface OrderStatus {
  id: string;
  title: string;
  timestamp: string;
  completed: boolean;
  current?: boolean;
}

interface OrderDetails {
  orderId: string;
  productName: string;
  productImage: string;
  orderDate: string;
  expectedDelivery: string;
  currentStatus: string;
  trackingNumber: string;
  shippingAddress: string;
  statuses: OrderStatus[];
}

const OrderTracking = () => {
  const [orderId, setOrderId] = useState("");
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(false);

  // Mock order data - in real app, this would come from an API
  const mockOrders: Record<string, OrderDetails> = {
    "SK123456789": {
      orderId: "SK123456789",
      productName: "Verified Organic Honey - 500ml",
      productImage: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=300&h=200&fit=crop&crop=entropy&auto=format",
      orderDate: "2024-01-15",
      expectedDelivery: "2024-01-20",
      currentStatus: "shipped",
      trackingNumber: "TRK789123456",
      shippingAddress: "123 Main Street, City, State 12345",
      statuses: [
        {
          id: "1",
          title: "Order Confirmed",
          timestamp: "2024-01-15 10:30 AM",
          completed: true,
        },
        {
          id: "2",
          title: "Product Verified & Packaged",
          timestamp: "2024-01-15 02:15 PM",
          completed: true,
        },
        {
          id: "3",
          title: "Shipped",
          timestamp: "2024-01-16 09:00 AM",
          completed: true,
          current: true,
        },
        {
          id: "4",
          title: "Out for Delivery",
          timestamp: "Expected: 2024-01-20 10:00 AM",
          completed: false,
        },
        {
          id: "5",
          title: "Delivered",
          timestamp: "Expected: 2024-01-20 06:00 PM",
          completed: false,
        },
      ],
    },
  };

  const handleTrackOrder = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const order = mockOrders[orderId.toUpperCase()];
      setOrderDetails(order || null);
      setLoading(false);
    }, 1500);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "status-processing";
      case "packaged":
        return "status-processing";
      case "shipped":
        return "status-shipped";
      case "delivered":
        return "status-delivered";
      default:
        return "status-pending";
    }
  };

  const getStatusIcon = (index: number, completed: boolean, current?: boolean) => {
    if (completed) {
      return <CheckCircle className="h-6 w-6 text-status-delivered" />;
    }
    if (current) {
      return (
        <div className="h-6 w-6 rounded-full bg-status-shipped flex items-center justify-center">
          <div className="h-3 w-3 rounded-full bg-white animate-pulse" />
        </div>
      );
    }
    return (
      <div className="h-6 w-6 rounded-full border-2 border-muted bg-background" />
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="relative mb-8 rounded-2xl overflow-hidden">
          <img 
            src={heroTracking} 
            alt="Order tracking"
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
            <div className="px-8">
              <h1 className="text-4xl font-bold text-white mb-2">
                Track Your Order
              </h1>
              <p className="text-white/90 text-lg">
                Enter your order ID to get real-time updates on your SafeKart purchase
              </p>
            </div>
          </div>
        </div>

        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Track Order
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                placeholder="Enter Order ID (e.g., SK123456789)"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={handleTrackOrder} 
                disabled={!orderId.trim() || loading}
                className="bg-gradient-to-r from-safekart-primary to-safekart-success hover:opacity-90"
              >
                {loading ? "Tracking..." : "Track Order"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {orderDetails && (
          <div className="space-y-6">
            {/* Order Summary */}
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">Order #{orderDetails.orderId}</CardTitle>
                    <p className="text-muted-foreground">
                      Placed on {new Date(orderDetails.orderDate).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge 
                    variant="secondary" 
                    className={`bg-${getStatusColor(orderDetails.currentStatus)}/10 text-${getStatusColor(orderDetails.currentStatus)} border-${getStatusColor(orderDetails.currentStatus)}/20`}
                  >
                    {orderDetails.currentStatus.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex gap-4">
                    <img 
                      src={orderDetails.productImage} 
                      alt={orderDetails.productName}
                      className="w-20 h-20 object-cover rounded-lg border"
                    />
                    <div>
                      <h3 className="font-semibold">{orderDetails.productName}</h3>
                      <p className="text-sm text-muted-foreground">
                        Tracking: {orderDetails.trackingNumber}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{orderDetails.shippingAddress}</span>
                    </div>
                    <p className="text-sm">
                      <strong>Expected Delivery:</strong>{" "}
                      {new Date(orderDetails.expectedDelivery).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Timeline */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Order Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {orderDetails.statuses.map((status, index) => (
                    <div key={status.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        {getStatusIcon(index, status.completed, status.current)}
                        {index < orderDetails.statuses.length - 1 && (
                          <div className={`w-0.5 h-12 mt-2 ${
                            status.completed ? 'bg-status-delivered' : 'bg-muted'
                          }`} />
                        )}
                      </div>
                      <div className="flex-1 pb-8">
                        <h4 className={`font-semibold ${
                          status.completed ? 'text-foreground' : 'text-muted-foreground'
                        }`}>
                          {status.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {status.timestamp}
                        </p>
                        {status.current && (
                          <div className="mt-2 flex items-center gap-2">
                            <Truck className="h-4 w-4 text-status-shipped" />
                            <span className="text-sm text-status-shipped font-medium">
                              Currently in transit
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {orderId && !orderDetails && !loading && (
          <Card className="shadow-lg">
            <CardContent className="text-center py-8">
              <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Order Not Found</h3>
              <p className="text-muted-foreground">
                Please check your order ID and try again. Make sure you've entered the correct format.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;
