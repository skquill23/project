import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Users, UserPlus, Check, X, Trash2, Search, Clock } from "lucide-react";
import { Friendship } from "@/hooks/useSocial";

interface FriendsListProps {
  userId: string;
  friends: Friendship[];
  pendingRequests: Friendship[];
  allUsers: { user_id: string; display_name: string; avatar_emoji: string }[];
  onSendRequest: (userId: string) => void;
  onRespondRequest: (id: string, accept: boolean) => void;
  onRemoveFriend: (id: string) => void;
  onChallenge: (opponentId: string) => void;
}

const FriendsList = ({
  userId, friends, pendingRequests, allUsers,
  onSendRequest, onRespondRequest, onRemoveFriend, onChallenge,
}: FriendsListProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const friendUserIds = new Set([
    ...friends.flatMap((f) => [f.requester_id, f.addressee_id]),
    ...pendingRequests.flatMap((f) => [f.requester_id, f.addressee_id]),
    userId,
  ]);

  const searchResults = searchQuery.length >= 2
    ? allUsers.filter(
        (u) => !friendUserIds.has(u.user_id) &&
          u.display_name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const incomingRequests = pendingRequests.filter((r) => r.addressee_id === userId);
  const outgoingRequests = pendingRequests.filter((r) => r.requester_id === userId);

  return (
    <div className="space-y-4">
      {/* Search & Add */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <UserPlus className="w-5 h-5 text-primary" />
            Find Training Partners
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          {searchResults.length > 0 && (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {searchResults.map((u) => (
                <div key={u.user_id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{u.avatar_emoji}</span>
                    <span className="font-medium text-sm">{u.display_name}</span>
                  </div>
                  <Button size="sm" onClick={() => onSendRequest(u.user_id)}>
                    <UserPlus className="w-4 h-4 mr-1" /> Add
                  </Button>
                </div>
              ))}
            </div>
          )}
          {searchQuery.length >= 2 && searchResults.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-2">No users found</p>
          )}
        </CardContent>
      </Card>

      {/* Incoming Requests */}
      {incomingRequests.length > 0 && (
        <Card className="border-primary/30">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="w-5 h-5 text-warning" />
              Pending Requests
              <Badge variant="secondary" className="ml-auto">{incomingRequests.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {incomingRequests.map((req) => (
              <div key={req.id} className="flex items-center justify-between p-3 rounded-lg bg-warning/5 border border-warning/20">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{req.requester_emoji}</span>
                  <div>
                    <p className="font-medium text-sm">{req.requester_name}</p>
                    <p className="text-xs text-muted-foreground">Wants to train with you</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="default" onClick={() => onRespondRequest(req.id, true)}>
                    <Check className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => onRespondRequest(req.id, false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Friends List */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="w-5 h-5 text-primary" />
            Training Partners
            <Badge variant="secondary" className="ml-auto">{friends.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {friends.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No friends yet. Search above to find training partners!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {friends.map((f) => {
                const isFriendRequester = f.requester_id !== userId;
                const friendName = isFriendRequester ? f.requester_name : f.addressee_name;
                const friendEmoji = isFriendRequester ? f.requester_emoji : f.addressee_emoji;
                const friendId = isFriendRequester ? f.requester_id : f.addressee_id;

                return (
                  <div key={f.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{friendEmoji}</span>
                      <div>
                        <p className="font-medium text-sm">{friendName}</p>
                        <p className="text-xs text-muted-foreground">Training Partner</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => onChallenge(friendId)}>
                        ⚔️ Battle
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => onRemoveFriend(f.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {outgoingRequests.length > 0 && (
            <div className="mt-4 pt-4 border-t space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Sent Requests</p>
              {outgoingRequests.map((req) => (
                <div key={req.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/20">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{req.addressee_emoji}</span>
                    <span className="text-sm text-muted-foreground">{req.addressee_name}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">Pending</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FriendsList;
