{
  description = "Dev shell for ReactNative 42 project";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-24.05";
  };

  outputs = { self, nixpkgs }:
    let
      system = "x86_64-linux";
      pkgs = import nixpkgs { inherit system; };
    in {
      devShells.${system}.default = pkgs.mkShell {
        name = "expo-node-shell";

        buildInputs = [
          pkgs.nodejs
          pkgs.zsh
          pkgs.pnpm
        ];

        shellHook = ''
            exec zsh
        '';
      };
    };
}
