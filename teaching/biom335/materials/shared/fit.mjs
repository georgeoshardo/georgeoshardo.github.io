// Rigid superposition for placing a structure onto geometry built in the page (a protein's crystal DNA onto
// a drawn duplex, say): the rotation and translation that best map points P onto points Q in the least
// squares sense (Horn's closed-form unit-quaternion method; the 4×4 eigenproblem is solved by Jacobi).
import * as THREE from 'three';

export function fitRigid(P, Q) {
  const n = P.length, cp = new THREE.Vector3(), cq = new THREE.Vector3();
  if (n < 3 || Q.length !== n) throw new Error('fitRigid needs three or more matched points');
  P.forEach(p => cp.add(p)); Q.forEach(q => cq.add(q)); cp.divideScalar(n); cq.divideScalar(n);
  // Cross-covariance S[a][b] = Σ (p − cp)_a (q − cq)_b.
  const S = [[0, 0, 0], [0, 0, 0], [0, 0, 0]], p = new THREE.Vector3(), q = new THREE.Vector3();
  for (let i = 0; i < n; i++) {
    p.subVectors(P[i], cp); q.subVectors(Q[i], cq);
    const a = [p.x, p.y, p.z], b = [q.x, q.y, q.z];
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) S[r][c] += a[r] * b[c];
  }
  const [[xx, xy, xz], [yx, yy, yz], [zx, zy, zz]] = S;
  const N = [
    [xx + yy + zz, yz - zy, zx - xz, xy - yx],
    [yz - zy, xx - yy - zz, xy + yx, zx + xz],
    [zx - xz, xy + yx, -xx + yy - zz, yz + zy],
    [xy - yx, zx + xz, yz + zy, -xx - yy + zz],
  ];
  const [w, x, y, z] = largestEigenvector(N);
  const rotation = new THREE.Quaternion(x, y, z, w).normalize();
  const translation = cq.clone().sub(cp.clone().applyQuaternion(rotation));
  return new THREE.Matrix4().compose(translation, rotation, new THREE.Vector3(1, 1, 1));
}

// Root-mean-square distance between matched points after mapping P by m.
export function fitError(m, P, Q) {
  let s = 0; const v = new THREE.Vector3();
  P.forEach((p, i) => { s += v.copy(p).applyMatrix4(m).distanceToSquared(Q[i]); });
  return Math.sqrt(s / P.length);
}

// Cyclic Jacobi rotations on a symmetric 4×4 matrix; the eigenvector of the largest eigenvalue.
function largestEigenvector(A) {
  const a = A.map(r => r.slice()), v = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
  for (let sweep = 0; sweep < 50; sweep++) {
    let off = 0;
    for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) off += a[i][j] * a[i][j];
    if (off < 1e-18) break;
    for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) {
      if (Math.abs(a[i][j]) < 1e-15) continue;
      const theta = (a[j][j] - a[i][i]) / (2 * a[i][j]);
      const t = Math.sign(theta || 1) / (Math.abs(theta) + Math.sqrt(theta * theta + 1)), c = 1 / Math.sqrt(t * t + 1), s = t * c;
      for (let k = 0; k < 4; k++) { const aki = a[k][i], akj = a[k][j]; a[k][i] = c * aki - s * akj; a[k][j] = s * aki + c * akj; }
      for (let k = 0; k < 4; k++) { const aik = a[i][k], ajk = a[j][k]; a[i][k] = c * aik - s * ajk; a[j][k] = s * aik + c * ajk; }
      for (let k = 0; k < 4; k++) { const vki = v[k][i], vkj = v[k][j]; v[k][i] = c * vki - s * vkj; v[k][j] = s * vki + c * vkj; }
    }
  }
  let best = 0; for (let i = 1; i < 4; i++) if (a[i][i] > a[best][best]) best = i;
  return [v[0][best], v[1][best], v[2][best], v[3][best]];
}
